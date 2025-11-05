# HCS Registry Example (Blueprint Registry)


This folder provides a minimal CLI + utilities to exercise the HCS topic/message layout:

0. Create a root registry topic 
1. Create Author Workflow List Topic 
2. Register an Author topic to the registry (slug → authorTopicId)
3. Create a workflow topic for a workflow slug that holds versions
4. Register the workflow topic into the author topic
5. Append a new workflow version (filesTopicId + tag), initially include a IPFS CID with data. 

.. Later (using HCS standards)
7. Create a Files Topic for a specific version (removes CID dependency)

And ability to track lineage of blueprint usage (if forked), or simply connect through an "instance standard" when the blueprint workflow has an instance. 

## Install

```bash
cd src/hcs-registry-example
npm i
cp .env.example .env
```

Edit .env with your Hedera testnet account + private key.

## Commands 

# 0ptional -- Create Root Workflow List Topic (returns topicId)

This is the topic where anyone can register to be an author for registering blueprints. 


```shell
bun cli.js create-root-topic
```

# 1) Create Author Workflow List Topic (returns topicId)

This is an Author topic that can register new blueprints and create new versions, this should be locked down by a submit key.

__Potentially__ consider that an "author workflow" as an unregistered entity is "private"

```shell
bun cli.js create-author-topic --slug dovu-labs
```

# 2) Register Author Topic on Root (needs preexisting author topic id)

This would enable an author to be discoverable.

__This may be tied to a payment in DOVU tokens in the future to reduce spam when sending a HCS message.__

```shell
bun cli.js register-author-topic \
--rootTopicId 0.0.7107142 \
--slug dovu-labs \
--authorTopicId 0.0.7106954 \
--txId 0.0.3644072@1761133534.803883280
```

# 3) Create Workflow Versions Topic for a given workflow slug

This creates a topic that is a registry of versions of a given workflow, and would enable searching of tags and versions.

```shell
node cli.js create-workflow-topic \
--slug wagyu-supply \
--title "Wagyu Cattle Provenance"
```
# 3b) Append Workflow Versions Topic to the author topic

Attach or register the workflow topic (containing versions) to the author topic, with a submit key.

```shell
node cli.js register-workflow-topic \
--slug wagyu-supply \
--workflowTopicId 0.0.67890 \
--title "Wagyu Cattle Provenance"
```

# 4) Append a new workflow version to its Versions Topic

A messa

Initially for simplicity’s sake we will use a IPFS CID to store to a document/data 

```shell
node cli.js add-workflow-version \
--filesTopicId 0.0.123 \
--cid "0x001" \
--tag v1.0.0
````

# Later) Create Files Topic for a workflow version (this would be later using the HCS standard)

```shell
node cli.js create-files-topic --slug wagyu-supply --version v1.0.0
```

## Tests

- `npm test` runs unit tests (pure JS, no network)
- `npm run test:e2e` runs opt‑in testnet checks when HEDERA_E2E=1 is set
