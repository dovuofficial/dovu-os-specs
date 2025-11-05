# Makefile

# Define the .env path (relative to this Makefile)
ENV_FILE ?= ../.env

root_topic.setup:
	bun cli.js create-root-topic

registry.author: root_topic.setup
	@echo "Creating Author Topic"
	bun cli.js create-author-topic
	@echo "Register Author to Root topic"
	bun cli.js register-author-topic --slug dovu-labs

registry.test: root_topic.setup registry.author
	@echo "Running Bun tests with $(ENV_FILE)..."
	bun test --env-file=$(ENV_FILE) --timeout=15000
