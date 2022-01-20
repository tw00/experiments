#!/usr/bin/env ts-node

import { Kafka, logLevel } from 'kafkajs';
import { WinstonLogCreator } from '../lib/logger';
import { genData } from './data';

const data = genData(10);
const types = Object.keys(data);

const kafka = new Kafka({
  clientId: 'cms-producer',
  brokers: ['localhost:9092', 'localhost:9092'],
  logLevel: logLevel.ERROR,
  logCreator: WinstonLogCreator,
});

// TODO: Topological sort

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x);
  }
};

const run = async () => {
  const producer = kafka.producer();
  await producer.connect();

  await mapSeries(types, async (type) => {
    return mapSeries(data[type], async (value) => {
      console.log(`- sending ${type}/${value.id}`);

      value.type = type; // hack
      const msg = { key: value.id || null, value: JSON.stringify(value) };

      await producer.send({
        topic: `monolog`,
        messages: [msg],
      });

      await producer.send({
        topic: `monolog-${type}`,
        messages: [msg],
      });
    });
  });

  await producer.disconnect();
};

run().catch(console.error);
