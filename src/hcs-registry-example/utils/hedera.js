import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  PrivateKey
} from "@hashgraph/sdk";

export function getHederaPublicKey() {
  const privateKey = process.env.HEDERA_PRIVATE_KEY;

  return PrivateKey.fromStringDer(privateKey).publicKey.toString();
}

export function getClient() {
  const network = process.env.HEDERA_NETWORK || "testnet";
  const accountId = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;
  if (!accountId || !privateKey) {
    throw new Error("Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in env");
  }
  const client =
    network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(accountId, privateKey);
  return client;
}

export async function createTopic({ memo = "", submitKeyPem } = {}) {
  const client = getClient();
  const tx = new TopicCreateTransaction();
  if (memo) tx.setTopicMemo(memo);
  if (submitKeyPem) {
    const submitKey = PrivateKey.fromStringDER(submitKeyPem).publicKey;
    tx.setSubmitKey(submitKey);
  }
  const res = await tx.execute(client);
  const rx = await res.getReceipt(client);

  return {
    transactionId: tx.transactionId.toString(),
    topicId: rx.topicId.toString()
  };
}


export async function submitMessage(topicId, messageBytes) {
  const client = getClient();
  const tx = new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(messageBytes);
  const res = await tx.execute(client);
  const rx = await res.getReceipt(client);
  return {
    status: rx.status.toString(),
    topicId
  };
}
