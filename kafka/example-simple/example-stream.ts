#!/usr/bin/env ts-node

import kafkaStreams from '../example-cms/lib/kafka';

const INPUT_TOPIC = 'monolog';
const OUTPUT_TOPIC = 'denolog';

async function run(exampleId) {
  const stream = kafkaStreams.getKStream(INPUT_TOPIC);

  // INFO: Stream must end with `reduce`, `forEach`, `drain`

  /* Example 1: */
  function Example1() {
    stream
      .from(INPUT_TOPIC)
      .mapJSONConvenience()
      .tap((kv) => console.log('MSG:', kv.key))
      .drain();
  }

  /* Example 2: */
  function Example2() {
    stream
      .mapJSONConvenience()
      .forEach(console.log)
      .then(() => console.log('All done'));
  }

  /* Example 3: */
  function Example3() {
    stream.mapJSONConvenience().reduce(Math.max, 0);
  }

  /* Example 4a: (mostly parallel - A is run twice) */
  function Example4a() {
    const fork = stream.mapJSONConvenience();
    fork.tap((kv) => console.log('A', kv.key)).drain();
    fork.tap((kv) => console.log('B', kv.key)).drain();
  }

  /* Example 4c: (sequential) */
  function Example4c() {
    const fork = stream.mapJSONConvenience();
    fork.forEach((kv) => console.log('A', kv.key));
    fork.forEach((kv) => console.log('B', kv.key));
  }

  /* Example 4b: (parallel - A is NOT run twice - AB,AB,AB) */
  function Example4b() {
    const fork = stream.mapJSONConvenience();
    fork.tap((kv) => console.log('A', kv.key));
    fork.tap((kv) => console.log('B', kv.key));
    fork.drain();
  }

  /* Example 5a: (parallel - duplicated: AAB,AAB) */
  function Example5a() {
    const fork = stream.mapJSONConvenience().multicast();
    fork.tap((kv) => console.log('A', kv.key)).drain();
    fork.tap((kv) => console.log('B', kv.key)).drain();
  }

  /* Example 5b: (parallel) */
  function Example5b() {
    const fork = stream.mapJSONConvenience().multicast();
    fork.forEach((kv) => console.log('A', kv.key));
    fork.forEach((kv) => console.log('B', kv.key));
  }

  /* Example 6: (sequential) */
  function Example6() {
    const [one$, two$] = stream.branch([() => true, () => true]);

    const producerPromiseOne = one$
      .mapJSONConvenience()
      .mapWrapKafkaValue()
      .tap((msg) => console.log('one:', msg.id))
      .drain();

    const producerPromiseTwo = two$
      .mapJSONConvenience()
      .mapWrapKafkaValue()
      .tap((msg) => console.log('two:', msg.id))
      .drain();

    Promise.all([producerPromiseOne, producerPromiseTwo]).then(() =>
      console.log('DONE'),
    );
  }

  /* Example 7: */
  function Example7() {
    stream
      .countByKey('category', 'count')
      .tap((kv) => console.log('COUNT:', kv))
      .filter((kv) => kv.count >= 3)
      .map((kv) => `${kv.category}  ${kv.count}`)
      .tap((kv) => console.log('MSG OUT:', kv))
      .to(OUTPUT_TOPIC);
  }

  /* Example 8: (sequential) */
  function Example8() {
    const [one$, two$] = stream.branch([
      (message) => message.key.toString('utf-8').match(/^[0-9]/),
      (message) => message.key.toString('utf-8').match(/^[a-z]/),
    ]);

    one$
      .multicast()
      .mapJSONConvenience()
      .forEach((msg) => console.log('one$', msg.key));
    two$
      .multicast()
      .mapJSONConvenience()
      .forEach((msg) => console.log('two$', msg.key));
  }

  ({
    Example1,
    Example2,
    Example3,
    Example4a,
    Example4c,
    Example4b,
    Example5a,
    Example5b,
    Example6,
    Example7,
    Example8,
  }[exampleId]());

  stream.start().then(() => {
    console.log(`created KStream from "${INPUT_TOPIC}"...`);
  });
}

run('Example8');
