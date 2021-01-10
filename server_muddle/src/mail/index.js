require("dotenv").config();

import { prisma } from "../../prisma/generated/prisma-client";
import { difference } from "lodash";
import { createTransport } from "nodemailer";
import htmlToText from "html-to-text";

const envToBool = (key) => {
  const envVar = process.env[key];
  if (!envVar) {
    throw new Error(`Envvar ${key} is required`);
  }

  if (envVar.toLocaleLowerCase() === "true") {
    return true;
  }
  if (envVar.toLocaleLowerCase() === "false") {
    return false;
  }

  throw new Error(`Envvar ${key} is invalid`);
};

const envToNumber = (key) => {
  const envVar = process.env[key];
  if (!envVar) {
    throw new Error(`Envvar ${key} is required`);
  }

  const res = parseInt(envVar);

  if (Number.isNaN(res)) {
    throw new Error(`Envvar ${key} is invalid`);
  }
  return res;
};

const smtpSecure = envToBool("SMTP_SECURE");
const smtpProd = envToBool("SMTP_PRODUCTION");
const smtpRateDelta = envToNumber("SMTP_QUOTA_DELTA");
const smtpRateLmit = envToNumber("SMTP_QUOTA_LIMIT");

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: smtpSecure,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  pool: true,
  maxConnections: 1,
  rateDelta: smtpRateDelta,
  rateLimit: smtpRateLmit,
});

const emailHeader = ``;

const emailFooter = `<hr size="1" color="black">
    <div display:"flex" justify-content="space-between">
      <span style="font-family:arial;color:olive;display:inline-block;margin-top:8px;margin-left:4px;">
      by <a href="https://www.muddles.fr/">Muddles</a></span>
      <span style="font-family:arial;color:gray;float:right;margin-top:8px;">Keep in touch via <a href="https://twitter.com/Muddle">Twitter</a></span>
    </div>`;

export async function sendMailNoReply({
  to,
  subject,
  text,
  html,
  attachments,
}) {
  if (!Array.isArray(to)) {
    to = [to];
  }

  const blockedUsers = await prisma.users({
    where: {
      mailStatus: "BLOCKED",
      email_in: to,
    },
  });
  const verifiedEmailAddress = difference(to, blockedUsers);
  if (!verifiedEmailAddress.length) {
    console.log(
      `Cancel mail sending, invalid email address for: "${subject}"`,
      {
        blockedUsers,
      }
    );
    return;
  }
  to = verifiedEmailAddress;

  if (!smtpProd) {
    console.log(`Sending (redirected to muddle-tech) "${subject}"`, {
      to,
    });
    subject = `[DEBUG] ${subject} [For ${to.join(",")}]`;
    to = "pro.muddles@gmail.com";
  } else {
    console.log(`Sending "${subject}"`, { to });
  }

  return transporter.sendMail({
    from: `"Muddles" <noreply@muddles.fr>`, // TODO: set email name & adress name
    to,
    subject,
    text,
    html,
    attachments,
  });
}

export async function sendMailNoReplyWithHeaderAndFooter(
  to,
  subject,
  html,
  attachments
) {
  let res;

  const text = htmlToText.fromString(html);
  try {
    res = await sendMailNoReply({
      to: to,
      subject: subject,
      text: text,
      html: `${emailHeader}${html}${emailFooter}`,
      attachments: attachments,
    });
  } catch (e) {
    res = e;
    log.error(e);
  }
  return res;
}
