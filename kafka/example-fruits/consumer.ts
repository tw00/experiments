#!/usr/bin/env ts-node
import { Kafka, logLevel } from 'kafkajs';
import { WinstonLogCreator } from '../lib/logger';

const OUTPUT_TOPIC = 'my-output-topic';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092', 'localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: OUTPUT_TOPIC, fromBeginning: false });

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

  consumer.seek({ topic: OUTPUT_TOPIC, partition: 0, offset: '4' });
};

run().catch(console.error);
