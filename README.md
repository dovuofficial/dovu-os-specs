# DOVU OS Data Specifications (WORKING SPECS, NOT A STANDARD)

This repo hosts **evolving specifications** for DOVU OS. These are **implementation-led** documents that track production reality. They are intended to be tightened into a formal standard with a neutral body (target: Q2–Q3 2026).

> We ship product first, then converge the spec to match what works in production.

## Scope (initial three specs)

1. **Blueprint Registry (Hedera HCS)** — how blueprints (aka workflows / templates) are discoverable, versioned, and provable on-chain. Includes Root Pointer, Author Workflow List, Versions, Files topics and the collision/ordering rules.  
   (See `specs/0001-blueprint-registry-hcs/`.)  
   Key normative rules include signature verification, append-only behavior, submitKey gating, and earliest-timestamp wins for collisions.

2. **Blueprint Instance Notary** — how a concrete run of a blueprint anchors step-by-step evidence (actors, payload hashes, timestamps) to HCS, with a final root hash binding the timeline.  
   (See `specs/0002-blueprint-instance-notary/`.)  
   Initial outline provided; full spec will follow the registry.

3. **Asset Model (HIP-412e)** — an extension of HIP-412 for modeling issued-assets and their metadata (including attestations/proofs) so any issued asset from a blueprint is indexable and verifiable across DOVU OS.

---

## Dual Context: IPFS + HCS

We support two parallel but **structurally identical** contexts:

- **IPFS (PoC-first)** — Current production (see `ipfs-poc/`). Blueprints and executions are pinned to IPFS; HCS is used optionally for anchoring CIDs and proving existence at a given timestamp.
- **Hedera HCS (spec-first)** — Normative backbone for ordering, timestamp provenance, and recovery. In this model, HCS carries the canonical log of blueprint registries and instances, while IPFS (or any content-addressed store) handles large file storage.

> **Same spec, different emphasis:** In IPFS-first deployments, the spec functions as a CID registry; in HCS-first, it functions as a full notary spine. HCS also acts as a backup/recovery mechanism if IPFS content is missing.

---

## Using HCS as a data stream module

DOVU OS enforces that all ingested behaviours for a given **blueprint instance** are published into a **linear queue (HCS topic)**. This ensures:

- **Canonical order of operations** — each step is recorded in strict sequence, mirroring how real-world actions occurred.
- **Causality guarantees** — order of operations matter so an actor can check or accept a step "before on-chain submission"; the queue prevents paradoxes that arise in purely timestamped or parallel systems.
- **Asynchronous safety** — actors can submit independently, but the resulting log is always a single, append-only chain per instance.

In short: **HCS topics are not just timestamps; they are the ordered spine that ensures DOVU OS respects real-world behaviour.**

---

## What this is NOT
- Not a frozen standard. Expect changes.
- Not a dump of implementation details—only protocol-facing behavior that third parties must rely on.

---

## Versioning
Each spec is semver’d independently, this is also connected to the version of the repo.

---

## Contributing
Open a PR with a design note in `rfcs/`. We only accept changes that either (a) match running code, or (b) are behind a feature flag with a migration plan. See `CONTRIBUTING.md`.

---

## Licensing
TBD (recommend: Apache-2.0 to maximize adoption).
