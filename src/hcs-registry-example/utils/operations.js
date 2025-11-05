import {createTopic, getHederaPublicKey, submitMessage} from "./hedera.js";
import {buildRootPointerMessage, buildWorkflowRegister, buildWorkflowVersion, encodeCanonical} from "./messages.js";
import {sha256, signEd25519Hex} from "./crypto.js";

/**
 * Topic creation
 */

export const createRootTopic = async (memo = "DOVU OS Registry Topic") =>
  createTopic({ memo })

export const createAuthorTopic = async (memo = "DOVU OS Author Topic") =>
  createTopic({ memo })

export const createWorkflowTopic = async (memo = "DOVU OS Workflow Topic") =>
  createTopic({ memo })

// Later this topic would relate to eliminating the need for IPFS CIDs
// const createFileTopic = async (memo = "N/A for initial pass") =>
//   createTopic({ memo })

/**
 * Registration to connect topics
 */

/**
 * authorPayload format
 * {
 *    slug,
 *    authorTopicId,
 *    ownerPubKey,
 *    txId,
 *    sig,
 *    alg
 *  }
 */
export const registerAuthorTopic = async (rootTopicId, authorPayload) => {

    const publicKey = getHederaPublicKey();
    const digest = sha256(authorPayload.txId);
    const sigHex = signEd25519Hex(process.env.HEDERA_PRIVATE_KEY, digest);

    const sigPayload = {
        ownerPubKey: publicKey,
        sig: sigHex,
        alg: "ED25519" // Implied default
    }

    const payload = buildRootPointerMessage({
        ...sigPayload,
        ...authorPayload,
    });

    return submitMessage(rootTopicId, encodeCanonical(payload));
}

/**
 * workflowPayload format
 * {
 *    slug,
 *    title,
 *    workflowTopicId
 *  }
 */
export const registerWorkflowTopic = async (authorTopicId, workflowPayload) => {

    const payload = buildWorkflowRegister(workflowPayload);

    return submitMessage(authorTopicId, encodeCanonical(payload));
}

/**
 * workflowVersionPayload format (v1 IPFS)
 * {
 *    type,
 *    content,
 *  }
 */
export const appendWorkflowVersion = async (workflowTopicId, versionPayload) => {

    const payload = buildWorkflowVersion(versionPayload);

    return submitMessage(workflowTopicId, encodeCanonical(payload));
}

