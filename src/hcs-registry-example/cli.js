#!/usr/bin/env node
import dotenv from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createTopic, getHederaPublicKey, submitMessage } from "./utils/hedera.js";
import { sha256, signEd25519Hex } from "./utils/crypto.js";
import {
    encodeCanonical,
    buildWorkflowVersion, FILE_FORMATS
} from "./utils/messages.js";
import { ensureEnvKey } from "./utils/env-utils.ts";
import {
    appendWorkflowVersion,
    createAuthorTopic,
    createRootTopic,
    createWorkflowTopic,
    registerAuthorTopic
} from "./utils/operations.js";

dotenv.config({ path: "../.env" });

function logJson(x) {
  console.log(JSON.stringify(x, null, 2));
}

yargs(hideBin(process.argv))
  .scriptName("hcs-registry")
    .command(
        "create-root-topic",
        "Create Root Topic for registry",
        (yargs) =>
            yargs.option("force", {
                alias: "f",
                type: "boolean",
                default: false,
                describe: "Force new topic creation even if one exists",
            }),
        async (argv) => {
            const KEY = "ROOT_REGISTRY_TOPIC";
            const existing = process.env[KEY];

            if (existing && !argv.force) {
                console.log(`✅ ${KEY} already in process.env (${existing}) — skipping creation.`);
                process.exit(0);
            }

            console.log(argv.force ? "♻️  Forcing topic regeneration..." : "🚀 Creating new root topic...");

            const topic = await createRootTopic();

            ensureEnvKey(KEY, topic.topicId, { force: argv.force });
            process.exit(0);
        }
    )
  .command(
    "create-author-topic",
    "Create Author Workflow List Topic",
    (y) =>
        y.option("slug", {
            type: "string",
            default: "dovu-labs",
            demandOption: true
        }).option("force", {
          alias: "f",
          type: "boolean",
          default: false,
          describe: "Force new topic creation even if one exists",
      }),
    async (args) => {
        const KEY = "AUTHOR_REGISTRY_TOPIC";
        const existing = process.env[KEY];

        if (existing && !args.force) {
            console.log(`✅ ${KEY} already in process.env (${existing}) — skipping creation.`);
            process.exit(0);
        }

        console.log(args.force ? "♻️  Forcing topic regeneration..." : "🚀 Creating new author topic...");

        const topic = await createAuthorTopic();

        ensureEnvKey(KEY, topic.topicId, { force: args.force });
        ensureEnvKey("AUTHOR_TOPIC_TX", topic.transactionId, { force: args.force });

        process.exit(0);
    }
  )
  .command(
    "register-author-topic",
    "Submit Root Pointer message to root topic",
    (y) =>
      y
        .option("rootTopicId",
            {
                type: "string",
                default: process.env.ROOT_REGISTRY_TOPIC,
                demandOption: true
            })
        .option("slug", { type: "string", demandOption: true })
        .option("authorTopicId",
            {
                type: "string",
                default: process.env.AUTHOR_REGISTRY_TOPIC,
                demandOption: true
            })
        .option("txId",
            {
                type: "string",
                default: process.env.AUTHOR_TOPIC_TX,
                demandOption: true
            })
        .option("signKey", {
          type: "string",
          describe: "DER private key used to sign sha256(txId)",
          default: process.env.HEDERA_PRIVATE_KEY
        }),
    async (args) => {

        // Inject keys/signing into payload.
        // const publicKey = getHederaPublicKey();
        // const digest = sha256(args.txId);
        // const sigHex = args.signKey ? signEd25519Hex(args.signKey, digest) : "12345678";
        //
        // const payload = buildRootPointerMessage({
        //   slug: args.slug,
        //   authorTopicId: args.authorTopicId,
        //   ownerPubKey: publicKey,
        //   txId: args.txId,
        //   sig: sigHex,
        //   alg: "ED25519"
        // });

        const res = await registerAuthorTopic(args.rootTopicId, {
          slug: args.slug,
          authorTopicId: args.authorTopicId,
          txId: args.txId,
        });

        logJson({ receipt: res });

        process.exit(0);
    }
  )
  .command(
    "create-workflow-versions",
    "Create Versions Topic for a given workflow slug",
      (yargs) =>
          yargs.option("force", {
              alias: "f",
              type: "boolean",
              default: false,
              describe: "Force new topic creation even if one exists",
          }),
    async (args) => {
        const KEY = "WORKFLOW_VERSION_TOPIC";
        const existing = process.env[KEY];

        if (existing && !args.force) {
            console.log(`✅ ${KEY} already in process.env (${existing}) — skipping creation.`);
            process.exit(0);
        }

        console.log(args.force ? "♻️  Forcing topic regeneration..." : "🚀 Creating new workflow version topic...");

        const topic = await createWorkflowTopic();

        ensureEnvKey(KEY, topic.topicId, { force: args.force });
        process.exit(0);
    }
  )
    // TODO: doesn't seem to be working.
  .command(
    "add-workflow-version",
    "Append a new version to an existing Versions Topic",
    (y) =>
      y
        .option("content", { type: "string", demandOption: true })
        .option("version", { type: "number", demandOption: true, default: 1 })
        .option("type", { type: "string", demandOption: true, default: FILE_FORMATS.IPFS }),
    async (args) => {

        const topicId = process.env.WORKFLOW_VERSION_TOPIC


        console.log(topicId)

        if (! topicId) {
            console.log(`Please generate workflow version topic`);
            process.exit(0);
        }

        const version = await appendWorkflowVersion(topicId, {
            // DOVU OS EDN reference
            type: args.type,
            content: args.content ?? "ipfs://Qme7FkcHpxqL4ZzZVY2vnJTPZzmqmq6cp6yySrMjWoWnaX",
            version: args.version ?? 1
        });

        logJson(version);
    }
  )
  .demandCommand(1)
  .help()
  .strict()
  .parse();
