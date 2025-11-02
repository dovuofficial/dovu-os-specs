import { PrivateKey } from "@hashgraph/sdk";
import { createHash } from "crypto";

export function sha256(data) {
  return createHash("sha256").update(data).digest();
}

export function signEd25519Hex(privateKeyPem, bytes) {
  const key = PrivateKey.fromStringDer(privateKeyPem);
  const sig = key.sign(bytes);
  return Buffer.from(sig).toString("hex");
}

export function signFromHederaKey(bytes) {
  signEd25519Hex(process.env.HEDERA_PRIVATE_KEY, bytes);
}
