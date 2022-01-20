#!/usr/bin/env ts-node
import { Kafka, logLevel } from 'kafkajs';
import { WinstonLogCreator } from '../lib/logger';

const demo_data = [
  'fruit banana',
  'fruit cherry',
  'vegetable broccoli',
  'fruit strawberry',
  'vegetable lettuce',
];

const N_MESSAGES = 5;

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  for (let i = 0; i < N_MESSAGES; i++) {
    await producer.send({
      topic: 'my-input-topic',
      messages: [{ value: demo_data[i % demo_data.length] }],
    });
  }
  await producer.disconnect();
};

run().catch(console.error);
