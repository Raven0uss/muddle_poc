require("dotenv").config();
// import express from "express";

import bodyParser from "body-parser";
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

server.express.post("/getImage", upload.single("test"), async function (
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

server.start({ port: 4000 }, () => {
  console.log("App running on http://localhost:4000");
});
