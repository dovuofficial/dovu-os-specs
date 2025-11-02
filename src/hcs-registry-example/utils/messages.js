import { z } from "zod";

// Canonical JSON encoding to ensure consistent bytes for signatures
export function encodeCanonical(obj) {
  return Buffer.from(JSON.stringify(obj));
}

// 2. Root Pointer Message
export const RootPointerSchema = z.object({
  slug: z.string().min(1),
  authorTopicId: z.string().min(3),
  ownerPubKey: z.string().min(8),
  txId: z.string().min(6),
  sig: z.string().min(8),
  alg: z.string().optional()
});

export function buildRootPointerMessage({
  slug,
  authorTopicId,
  ownerPubKey,
  txId,
  sig,
  alg = "ED25519"
}) {
  const msg = { slug, authorTopicId, ownerPubKey, txId, sig, alg };
  return RootPointerSchema.parse(msg);
}

// 3. Author Workflow List Topic message
export const WorkflowRegisterSchema = z.object({
  t: z.literal("workflow-register@1"),
  slug: z.string().min(1),
  versionsTopicId: z.string().min(3),
  title: z.string().min(1),
  tags: z.string().optional()
});


export function buildWorkflowRegister({ slug, versionsTopicId, title, tags }) {
  return WorkflowRegisterSchema.parse({
    t: "workflow-register@1",
    slug,
    versionsTopicId,
    title,
    tags
  });
}


// 4. Workflow Version message
export const WorkflowVersionSchema = z.object({
  t: z.literal("workflow-version@1"),
  filesTopicId: z.string().min(3),
  tags: z.string().min(1)
});

export function buildWorkflowVersion({ filesTopicId, tag }) {
  return WorkflowVersionSchema.parse({
    t: "workflow-version@1",
    filesTopicId,
    tags: tag
  });
}
