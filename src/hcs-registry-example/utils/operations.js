import {createTopic, submitMessage} from "./hedera.js";
import {buildRootPointerMessage, encodeCanonical} from "./messages.js";

/**
 * Definitions of operations for certain topic and message creation in relation to the blueprint registry context
 */
const operation = {
  REGISTER: {
    AUTHOR: {
      v1: "author-register@1"
    },

    WORKFLOW: {
      v1: "workflow-register@1"
    },
  },

  APPEND: {
    VERSION: {
      v1: "workflow-version-create@1"
    }
  }
}

/**
 * Topic creation
 */

const createRootTopic = async (memo = "DOVU OS Registry Topic") =>
  createTopic({ memo })

const createAuthorTopic = async (memo = "DOVU OS Author Topic") =>
  createTopic({ memo })

const createWorkflowTopic = async (memo = "DOVU OS Workflow Topic") =>
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
const registerAuthorTopic = async (rootTopicId, authorPayload) => {

  const payload = buildRootPointerMessage({
    t: operation.REGISTER.AUTHOR,
    ...authorPayload,
  });

  return submitMessage(rootTopicId, encodeCanonical(payload));
}

const createAuthorInstance = async () => {

}



export default {
  createRootTopic,
  createAuthorTopic,
  createWorkflowTopic,
  registerAuthorTopic,
};


