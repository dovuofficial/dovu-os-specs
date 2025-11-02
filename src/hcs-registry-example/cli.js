#!/usr/bin/env node
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {createTopic, getHederaPublicKey, submitMessage} from "./utils/hedera.js";
import { sha256, signEd25519Hex } from "./utils/crypto.js";
import {
  encodeCanonical,
  buildRootPointerMessage,
  buildWorkflowRegister,
  buildWorkflowVersion
} from "./utils/messages.js";

dotenv.config({ path: "../.env" });

function logJson(x) {
  console.log(JSON.stringify(x, null, 2));
}

yargs(hideBin(process.argv))
  .scriptName("hcs-registry")
  .command(
    "create-root-topic",
    "Create Root Topic for registry",
    async (args) => {
      const topic = await createTopic({
        memo: "DOVU OS Root Topic",
      });
      logJson(topic);

      process.exit(0);
    }
  )
  .command(
    "create-author-awl",
    "Create Author Workflow List Topic",
    (y) => y.option("slug", { type: "string", demandOption: true }),
    async (args) => {
      const topic = await createTopic({ memo: args.slug });
      logJson(topic);

      process.exit(0);
    }
  )
  .command(
    "register-root-pointer",
    "Submit Root Pointer message to root topic",
    (y) =>
      y
        .option("rootTopicId", { type: "string", demandOption: true })
        .option("slug", { type: "string", demandOption: true })
        .option("authorTopicId", { type: "string", demandOption: true })
        .option("txId", { type: "string", demandOption: true })
        .option("signKey", {
          type: "string",
          describe: "DER private key used to sign sha256(authorTopicId)",
          default: process.env.HEDERA_PRIVATE_KEY
        }),
    async (args) => {
      const publicKey = getHederaPublicKey();
      const digest = sha256(args.txId);
      const sigHex = args.signKey ? signEd25519Hex(args.signKey, digest) : "12345678";

      const payload = buildRootPointerMessage({
        slug: args.slug,
        authorTopicId: args.authorTopicId,
        ownerPubKey: publicKey,
        txId: args.txId,
        sig: sigHex,
        alg: "ED25519"
      });

      const res = await ter(args.rootTopicId, encodeCanonical(payload));

      logJson({ payload, receipt: res });

      process.exit(0);
    }
  )
  .command(
    "create-workflow-versions",
    "Create Versions Topic for a given workflow slug",
    (y) =>
      y
        .option("slug", { type: "string", demandOption: true })
        .option("title", { type: "string", demandOption: true }),
    async (args) => {
      const versionsTopicId = await createTopic({ memo: `VERSIONS:${args.slug}` });
// this is typically recorded on the Author Workflow List Topic
      console.log(JSON.stringify({ versionsTopicId }, null, 2));
    }
  )
  .command(
    "add-workflow-version",
    "Append a new version to an existing Versions Topic",
    (y) =>
      y
        .option("versionsTopicId", { type: "string", demandOption: true })
        .option("filesTopicId", { type: "string", demandOption: true })
        .option("tag", { type: "string", demandOption: true }),
    async (args) => {
      const payload = buildWorkflowVersion({
        filesTopicId: args.filesTopicId,
        tag: args.tag
      });
      const res = await submitMessage(args.versionsTopicId, encodeCanonical(payload));
      logJson({ payload, receipt: res });
    }
  )
  .command(
    "create-files-topic",
    "Create Files Topic (empty) for a given workflow version",
    (y) =>
      y
        .option("slug", { type: "string", demandOption: true })
        .option("version", { type: "string", demandOption: true }),
    async (args) => {
      const topicId = await createTopic({ memo: `FILES:${args.slug}@${args.version}` });
      logJson({ filesTopicId: topicId });
    }
  )
  .demandCommand(1)
  .help()
  .strict()
  .parse();
