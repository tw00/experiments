#!/usr/bin/env ts-node
import { KafkaStreams } from 'kafka-streams';
import config from './config';
import type { KafkaMessage } from 'kafkajs';

const keyMapperEtl = (kafkaMessage: KafkaMessage) => {
  const value = kafkaMessage.value.toString('utf8');
  const elements = value.toLowerCase().split(' ');
  console.log('elements', elements);
  return {
    category: elements[0],
    type: elements[1],
  };
};

const kafkaStreams = new KafkaStreams(config);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(kafkaStreams as any)?.on('error', (error) => {
  console.log('Error occured:', error.message);
});

const stream = kafkaStreams.getKStream();

const INPUT_TOPIC = 'my-input-topic';
const OUTPUT_TOPIC = 'my-output-topic';

stream
  .from(INPUT_TOPIC)
  .map(keyMapperEtl)
  .countByKey('category', 'count')
  .tap((kv) => console.log('COUNT:', kv))
  .filter((kv) => kv.count >= 3)
  .map((kv) => `${kv.category}  ${kv.count}`)
  .tap((kv) => console.log('MSG OUT:', kv))
  .to(OUTPUT_TOPIC);

stream.start().then(() => {
  console.log(`listening to "${INPUT_TOPIC}"...`);
});
