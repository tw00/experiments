#!/usr/bin/env ts-node

import kafkaStreams from './lib/kafka';

const INPUT_TOPIC = 'monolog';

function toKV(kafkaMessage) {
  const key = kafkaMessage.key.toString('utf8');
  const value = JSON.parse(kafkaMessage.value.toString('utf8'));
  return { key, value };
}

async function run() {
  const table = kafkaStreams.getKTable(INPUT_TOPIC, toKV, null);
  const stream = kafkaStreams.getKStream(INPUT_TOPIC);

  table.consumeUntilMs(1000, async () => {
    const tab: Record<string, any> = await table.getTable();
    console.log('tab', Object.keys(tab));
  });

  const [one$, two$] = stream.branch([
    (message) => message.key.toString('utf-8').match(/^[0-9]/),
    (message) => message.key.toString('utf-8').match(/^[a-z]/),
  ]);

  one$.mapJSONConvenience().forEach((msg) => console.log('one$', msg.key));
  two$.mapJSONConvenience().forEach((msg) => console.log('two$', msg.key));

  Promise.all([stream.start(), table.start()]).then(() => {
    console.log(`created KStream from "${INPUT_TOPIC}"...`);
  });
}

run();
