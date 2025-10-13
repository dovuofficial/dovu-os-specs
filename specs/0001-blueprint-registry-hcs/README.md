# Blueprint Registry (Hedera Consensus Service)

This document describes the **Hedera Consensus Service (HCS)** version of the **Blueprint Registry** for DOVU OS.

It succeeds the original [IPFS Proof of Concept](../../ipfs-poc/README.md), using the same conceptual model but introducing verifiable **ordering**, **authorship**, and **immutability**.

---

## Purpose

The Blueprint Registry defines how blueprints (workflows or templates) are:
- **Registered** by their authors
- **Versioned** across updates
- **Proven** through timestamped records on-chain

It ensures that every blueprint published in DOVU OS can be **traced, verified, and ordered** in a way that reflects real-world authorship and evolution.

---

## Why HCS

DOVU OS uses the **Hedera Consensus Service (HCS)** as the foundational module for this specification because it provides:

- **Trusted timestamping** — every message is assigned an immutable consensus timestamp.
- **Linear ordering** — messages are processed in sequence, removing ambiguity about the order of publication.
- **Tamper evidence** — once recorded, no entry can be edited or deleted.
- **Decentralised verification** — ordering and timestamps are confirmed by the Hedera network, not by DOVU.

This makes HCS the **ideal layer for registry provenance**, while IPFS remains the **data storage layer** for the actual blueprint files.

> **Summary:** IPFS holds the content. HCS proves when and in what order that content was registered.

---

## Structure

Each author maintains a dedicated HCS topic chain that represents their registry:

```
(ownerPubKey) → Root Pointer → Author Workflow List → Versions → Files
```

- **Root Pointer** — links the author’s public key to their registry root.
- **Author Workflow List** — lists all blueprints published by that author.
- **Versions** — tracks all released versions for a given blueprint.
- **Files** — lists or hashes the files that make up a specific version.

This structure guarantees that the **order of publication** and **authorship** can be independently verified.

---

## How It Relates to the IPFS PoC

The HCS Registry uses the **same folder and naming convention** as the IPFS version, but all critical events (create, update, version, publish) are now **anchored to HCS**.

| PoC Concept | HCS Equivalent |
|-------------|----------------|
| Folder structure | Topic hierarchy |
| Folder CID | `filesTopicId` hash |
| Upload timestamp | Hedera consensus timestamp |
| Manual versioning | Deterministic append-only log |
| Author identity implicit | Author key verified |

> The result: a **verifiable timeline of blueprint evolution** that mirrors the PoC’s practicality while adding provable trust.

---

## Behaviour Rules (Simplified)

1. **Each author owns a single root pointer.**
2. **Each blueprint slug** (e.g. `aerospace-parts`) belongs to that author’s registry.
3. **Each version** (e.g. `v1.0.0`) is recorded as a new event in HCS with a timestamp.
4. **Order is final** — the earliest timestamp wins in case of conflict.
5. **Files remain stored in IPFS**; only hashes and metadata live on HCS.
6. **All operations are append-only.**

---

## Current Status

- **Specification:** Working draft (v1.0.0)
- **Production alignment:** Running logic proven via IPFS for 6–9 months
- **Next phase:** Integrate bidirectional sync between IPFS and HCS

---

## Summary

The **Blueprint Registry (HCS)** transforms DOVU’s earlier proof of concept into a **verifiable, timestamped ledger** of blueprint authorship and evolution.

It preserves the simplicity of IPFS-based storage while introducing Hedera’s **consensus-backed ordering**, ensuring every workflow has a clear, immutable, and auditable history.

