# Blueprint Registry — IPFS Proof of Concept (PoC)

This document describes the **original DOVU OS implementation** for blueprint storage and registration, built entirely on **IPFS (Filebase)**.  
It represents the first working model of the registry before the introduction of **Hedera Consensus Service (HCS)** for ordering and timestamp provenance.

---

## Overview

The IPFS PoC established a **functional registry** where all blueprints were stored as **folders within IPFS buckets**, organized by human-readable names and versions.  
Each folder represented a distinct **workflow blueprint**, containing both the human-readable specification and the compiled configuration used in production.

### Goals of the PoC
1. Provide a working system for blueprint discovery and storage.
2. Enable external systems to fetch and reproduce the same workflow using a single CID reference.
3. Demonstrate how DOVU OS could manage digital provenance before HCS integration.
4. Serve as the bridge between static documentation and live execution.

---

## Registry Structure (Filebase Layout)

The top-level structure mirrored an **author-level registry**, where each folder corresponded to a blueprint “slug” (human identifier).  
Each blueprint contained one or more **semantic versions** (e.g., `v1.0.0`).

```
/registry/
├─ aerospace-parts/
│ └─ v1.0.0/
│ ├─ specification/
│ ├─ compiled/
│ └─ manifest.json
├─ aviation-parts/
│ └─ v1.0.0/
│ ├─ specification/
│ ├─ compiled/
│ └─ manifest.json
├─ irec/
│ └─ v1.0.0/
│ ├─ specification/
│ ├─ compiled/
│ └─ irec.php
└─ ...
```

Each directory structure included:
- `specification/` — documentation of the workflow, roles, and schema definitions.
- `compiled/` — processed workflow files ready for execution in DOVU OS.
- `manifest.json` — a machine-readable index of files and hashes.
- (Sometimes) a single `.php` or `.json` file if the workflow was self-contained.

---

## Naming & Addressing

- Each blueprint (e.g., `aerospace-parts`, `irec`, `uk-driving-license`) acted as a **slug**, representing a unique category of workflow.
- Each version (e.g., `v1.0.0`) was published under that slug, with its folder pinned to IPFS.
- The **CID** at each version level acted as the canonical reference for that blueprint version.

> Example:  
> `/registry/irec/v1.0.0` → `QmY7hkRUtiqeHXPEEBK4AqgDck...`  
> This CID represented the entire workflow, specification, and compiled data for IREC v1.0.0.

---

## Strengths

✅ **Simplicity** — easy to publish, retrieve, and pin versions via IPFS.  
✅ **Immutable references** — every update generated a new CID, guaranteeing auditability.  
✅ **Universal accessibility** — anyone could retrieve the same data using public gateways.  
✅ **Provenance by content hash** — although not timestamped, the data was cryptographically verifiable.

---

## Limitations

❌ **No canonical author binding** — anyone could upload a folder with the same slug.  
❌ **No collision resolution** — duplicate or conflicting versions were indistinguishable.  
❌ **No temporal ordering** — impossible to determine which version was published first.  
❌ **No verifiable ownership** — CIDs could be pinned or mirrored by any party.  
❌ **No append-only enforcement** — old versions could be replaced manually.

These weaknesses motivated the next stage — the **Blueprint Registry (HCS)** spec — which introduces:
- Author identity binding via `ownerPubKey`
- Append-only rules
- Earliest-wins timestamp resolution
- submitKey gating to prevent tampering

---

## Purpose of Retaining This PoC

This document and structure are retained to:
- Provide a **reference baseline** for the production system that’s been running for 6–9 months.
- Act as a **migration bridge** when transitioning data to the HCS-based registry.
- Preserve the historical evolution of DOVU OS’ audit and provenance system.

---

## Migration Path (Simplified)

| From PoC (IPFS) | To HCS Spec |
|-----------------|-------------|
| Folder name (slug) | `workflow-register@1.slug` |
| Version folder | `workflow-version@1.tag` |
| Manifest CID | `filesTopicId` (first message) |
| Folder timestamp | Consensus timestamp (derived) |
| Manual upload | submitKey-controlled write |
| No ownership | `ownerPubKey` binding |

---

## Summary

The **IPFS PoC** proved the concept of a decentralized, verifiable registry.  
It formed the basis for the HCS-backed **Blueprint Registry**, which now adds **authorship, ordering, and causal integrity** — ensuring that what was once a static file tree becomes a provable, tamper-evident ledger of blueprint evolution.


