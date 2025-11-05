# 🧰 Registry Setup Guide

This project uses **[Bun](https://bun.sh)** and **Makefile automation** to create and manage Hedera registry topics.  
Follow the steps below to get started.

---

## ⚙️ 1. Prerequisites

Make sure you have:

- **Bun** installed — [Install Guide](https://bun.sh/docs/installation)
- A **Hedera testnet account** from [portal.hedera.com](https://portal.hedera.com)
- Your **Hedera Account ID** and **Private Key**

---

## 🧩 2. Configure Environment Variables

Create a new `.env` file in the project root (or copy the example):

```bash
cp .env.example .env
```

Then edit the file and add your Hedera credentials:

```
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
```

### Note: ROOT_REGISTRY_TOPIC will be automatically created and written to .env when running setup.

# 🧪 3. Run the Registry Test Setup

Use the provided Makefile to automatically create the root topic, author topic, and run tests:

```
make registry.test
```
This will:

1. Create a Root Topic if one doesn’t exist
2. Create and register an Author Topic
3. Run Bun tests using your .env configuration

# 🗂️ 4. Inspect the Generated Topics

After running the command, open your .env file — it should now include your new topic IDs, for example:

```
ROOT_REGISTRY_TOPIC=0.0.7182811
```

You can view this topic on HashScan
by searching for the topic ID.

## ✅ Quick Commands

| Command | Description |
|----------|--------------|
| `make root_topic.setup` | Creates or updates the root registry topic |
| `make registry.author`  | Creates and registers the author topic |
| `make registry.test`    | Runs all setup dependencies and executes tests |
