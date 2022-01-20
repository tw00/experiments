#!/usr/bin/env ts-node
import { Kafka, logLevel } from 'kafkajs';
import { WinstonLogCreator } from '../lib/logger';

// const OUTPUT_TOPIC = 'monolog';
const OUTPUT_TOPIC = 'denolog';

const kafka = new Kafka({
  clientId: 'cms-consumer',
  brokers: ['localhost:9092', 'localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

function decode(msg) {
  if (!msg || !msg.value || !msg.value.toString) {
    return 'n/a';
  }
  try {
    return JSON.parse(msg.value.toString());
  } catch (error) {
    return `failed (${msg.value})`;
  }
}

const run = async () => {
  const consumer = kafka.consumer({ groupId: 'consumer-group-2' });
  await consumer.connect();
  await consumer.subscribe({ topic: OUTPUT_TOPIC, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: decode(message),
        key: message?.key?.toString('utf-8') ?? 'n/a',
      });
    },
  });

  consumer.seek({ topic: OUTPUT_TOPIC, partition: 0, offset: '0' });
};

run().catch(console.error);
