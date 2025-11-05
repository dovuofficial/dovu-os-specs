import { expect, test } from "bun:test";

import {
    appendWorkflowVersion,
    createAuthorTopic,
    createRootTopic,
    createWorkflowTopic,
    registerAuthorTopic,
    registerWorkflowTopic
} from "../utils/operations.js"

/**
 * Use root topic that has been generated before or alternatively create a new one.
 */
test("Use or generate root topic", async () => {

    const registry = process.env.ROOT_REGISTRY_TOPIC

    if (registry) {

        console.log("Root topic already generated")

        return expect(true)
    }

    const topic = await createRootTopic()

    expect(topic).toEqual(
        expect.objectContaining({
            transactionId: expect.any(String),
            topicId: expect.any(String),
        })
    );
});

/**
 * Create a new author topic and register into the root topic
 */
test("Generate an author topic and register to root topic", async () => {

    let author_topic = process.env.AUTHOR_REGISTRY_TOPIC
    let topic_tx = process.env.AUTHOR_TOPIC_TX

    if (! author_topic) {

        const topic = await createAuthorTopic()

        author_topic = topic.topicId
        topic_tx = topic.transactionId
    }

    expect(!! author_topic)
    expect(!! topic_tx)

    const result = await registerAuthorTopic(process.env.ROOT_REGISTRY_TOPIC, {
        slug: "dovu-labs",
        authorTopicId: author_topic,
        txId: topic_tx,
    });

    expect(result).toEqual(
        expect.objectContaining({
            status: "SUCCESS",
            topicId: expect.any(String),
        })
    );
});

/**
 * Create a new workflow (versions) topic and register into the author topic
 */
test("Generate a workflow topic, register to author topic, then create a version", async () => {

    const {
        topicId,
    } = await createWorkflowTopic()

    expect(!! topicId)

    const result = await registerWorkflowTopic(process.env.AUTHOR_REGISTRY_TOPIC, {
        slug: "dovu-labs",
        title: "DOVU Labs",
        workflowTopicId: topicId,
    });

    console.log(process.env.AUTHOR_TOPIC_TX);

    expect(result).toEqual(
        expect.objectContaining({
            status: "SUCCESS",
            topicId: expect.any(String),
        })
    );

    const version = await appendWorkflowVersion(topicId, {
        // DOVU OS EDN reference
        content: "ipfs://Qme7FkcHpxqL4ZzZVY2vnJTPZzmqmq6cp6yySrMjWoWnaX",
    });

    expect(version).toEqual(
        expect.objectContaining({
            status: "SUCCESS",
            topicId: expect.any(String),
        })
    );
});

// /**
//  * Create a new author topic and register into the root topic
//  */
// test("Use or generate root topic", async () => {
//
//
// });