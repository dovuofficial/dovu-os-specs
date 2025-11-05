import { z } from "zod";

/**
 * Definitions of operations for certain topic and message creation in relation to the blueprint registry context
 */
export const OPERATION = {
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

export const FILE_FORMATS = {
    IPFS: "IPFS",
    HCS: "HCS"
}


// Canonical JSON encoding to ensure consistent bytes for signatures
export function encodeCanonical(obj) {
    return Buffer.from(JSON.stringify(obj));
}

// 2. Root Pointer Message
export const RootPointerSchema = z.object({
    t: z.literal(OPERATION.REGISTER.AUTHOR.v1),
    slug: z.string().min(1),
    authorTopicId: z.string().min(3),
    ownerPubKey: z.string().min(8),
    txId: z.string().min(6),
    sig: z.string().min(8),
    alg: z.string().optional()
});

export function buildRootPointerMessage({
  t = OPERATION.REGISTER.AUTHOR.v1,
  slug,
  authorTopicId,
  ownerPubKey,
  txId,
  sig,
  alg = "ED25519"
}) {
  const msg = { t, slug, authorTopicId, ownerPubKey, txId, sig, alg };
  return RootPointerSchema.parse(msg);
}

// 3. Author Workflow List Topic message
export const WorkflowRegisterSchema = z.object({
  t: z.literal(OPERATION.REGISTER.WORKFLOW.v1),
  slug: z.string().min(1),
  workflowTopicId: z.string().min(3),
  title: z.string().min(1),
  tags: z.string().optional()
});

export function buildWorkflowRegister({ slug, workflowTopicId, title, tags }) {
  return WorkflowRegisterSchema.parse({
    t: OPERATION.REGISTER.WORKFLOW.v1,
    slug,
    workflowTopicId,
    title,
    tags
  });
}

// 4. Workflow Version, relates to an IPFS CID for data
export const WorkflowVersionSchema = z.object({
    t: z.literal(OPERATION.APPEND.VERSION.v1),
    type: z.enum(Object.keys(FILE_FORMATS)),
    version: z.number().min(1),
    content: z.string().min(3) // IPFS CID or HCS (Hashinal)
});

export function buildWorkflowVersion({
    content,
    version = 1,
    type = FILE_FORMATS.IPFS
}) {
    return WorkflowVersionSchema.parse({
        t: OPERATION.APPEND.VERSION.v1,
        type,
        content,
        version
    });
}
