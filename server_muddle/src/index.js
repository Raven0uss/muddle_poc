require("dotenv").config();

import { GraphQLServer } from "graphql-yoga";
import { prisma } from "../prisma/generated/prisma-client";

import permissions from "./permissions";
import schema from "./schema";

import getCurrentUser from "./permissions/getCurrentUser";
import multer from "multer";

import { Image4ioClient } from "../image4ionodeSDK/out/Image4ioAPI";
import { UploadImagesRequest } from "../image4ionodeSDK/out/Models/index";
import { get, isNil } from "lodash";
import fs from "fs";

const upload = multer({ dest: "uploads/" });
const img4io_apiKey = process.env.IMG4IO_API_KEY;
const img4io_apiSecret = process.env.IMG4IO_API_SECRET;
// console.log(img4io_apiKey);

const server = new GraphQLServer({
  schema,
  middlewares: [permissions],

  context: async ({ request }) => {
    // console.log(request.headers.token);
    const currentUser = await getCurrentUser(request);
    // console.log(currentUser);
    return {
      currentUser,
      prisma,
    };
  },
});

server.express.post("/getImage", upload.single("test"), async function(
  req,
  res,
  next
) {
  try {
    const image = get(req, "file.path");
    // console.log(image);
    if (isNil(image)) res.status(400).send("Image not found.");

    const client = new Image4ioClient(img4io_apiKey, img4io_apiSecret);
    const request = new UploadImagesRequest("/", true, true);
    request.Add(image, "test", "test.jpg");
    const response = await client.UploadImage(request);

    // console.log(response);
    const imageUrl = get(response, "uploadedFiles[0].url");
    // console.log(imageUrl);

    if (isNil(imageUrl)) res.status(400).send("Error API");
    fs.unlink(image, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    // console.log(imageUrl);
    res.send(imageUrl);
  } catch (err) {
    res.status(400).send("Try catch triggered.");
  }
});

server.express.post("/sns/email/error-notification", async function(
  req,
  res,
  next
) {
  try {
    log.info("SNS Email Notification content", req.body, req.headers);
    const msg = JSON.parse(req.body.Message);

    if (msg.notificationType === "Delivery") {
      const users = await prisma.users({
        where: {
          email_in: msg.delivery.recipients,
        },
      });

      await Promise.all(
        users
          .filter((u) => u.mailErrors.length > 0)
          .map((u) =>
            prisma.updateUser({
              where: { id: u.id },
              data: {
                mailErrors: u.mailErrors - 1,
              },
            })
          )
      );
    } else if (msg.notificationType === "Bounce") {
      const mails = msg.bounce.bouncedRecipients.map((b) => b.emailAddress);

      const users = await prisma.users({
        where: {
          email_in: mails,
        },
      });

      const isSoft =
        msg.bounce.bounceType === "Undetermined" ||
        msg.bounce.bounceType === "Transient";

      if (users.length === mails.length) {
        log.info(`SNS Receive email to flag (soft: ${isSoft}`, mails);
      } else {
        log.error(
          "SNS Receive email to flag, but some are not found in database",
          mails
        );
      }

      if (isSoft) {
        await Promise.all(
          users
            .filter((u) => u.mailStatus !== "BLOCKED")
            .map((u) => {
              const data = {
                mailErrors: u.mailErrors + 1,
              };
              if (data.mailErrors >= 3) {
                log.info(`SNS block user ${u.id}`);
                data.mailStatus = "BLOCKED";
              }

              return prisma.updateUser({
                where: { id: u.id },
                data,
              });
            })
        );
      } else if (msg.bounce.bounceType === "Permanent") {
        await Promise.all(
          users.map((u) =>
            prisma.updateUser({
              where: { id: u.id },
              data: {
                mailStatus: "BLOCKED",
              },
            })
          )
        );
      }
    }

    res.status(200).json();
  } catch (err) {
    res.status(500).send("Try catch triggered.");
  }
});

server.start({ port: 4000, playground: false }, () => {
  console.log("App running on http://localhost:4000");
});
