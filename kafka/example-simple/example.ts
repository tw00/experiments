#!/usr/bin/env ts-node
import { Kafka, logLevel } from 'kafkajs';
import { WinstonLogCreator } from '../lib/logger';

const kafka = new Kafka({
  clientId: 'my-app',
  // brokers: ['kafka1:9092', 'kafka2:9092'],
  brokers: ['localhost:9092', 'localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  // Producing
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [{ value: 'Hello KafkaJS user!' }],
  });

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

run().catch(console.error);
