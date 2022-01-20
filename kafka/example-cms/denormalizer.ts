#!/usr/bin/env ts-node

import kafkaStreams from './lib/kafka';
import { traverseTreeAndMatchValue } from './lib/utils';

const INPUT_TOPIC = 'monolog';
const OUTPUT_TOPIC = 'denolog';

// TODO: Type should be a field on the data itself
function guessType(obj) {
  switch (true) {
    case !!obj.title:
      return 'article';
    case !!obj.firstName:
      return 'author';
    case !!obj.width:
      return 'image';
  }
}

async function run() {
  const stream = kafkaStreams.getKStream(INPUT_TOPIC);

  const [one$, two$, three$] = stream.branch([
    () => true,
    () => true,
    () => true,
  ]);

  const depTable = {};
  const kTable = {};
  const processLog = [];

  const uriMatcher = (v) => typeof v === 'string' && v.startsWith('hearst://');
  const dereference = (uri: string) => kTable[uri] || null;
  // const dereference = (uri: string) => kTable[uri.split('/').pop()] || null;
  const makeUri = (type, key) => `hearst://${type}/${key.toString('utf-8')}`;
  const addType = ({ key, value }) => ({
    key,
    value: { ...value, type: guessType(value) },
  });

  function findRoots(start: string): string[] {
    const deps = depTable[start];
    if (!deps || deps.length === 0) {
      return [start];
    } else {
      const roots = deps.flatMap((dep) => findRoots(dep));
      return roots;
    }
  }

  one$
    .mapBufferValueToString()
    .mapStringValueToJSONObject()
    .map(addType)
    .forEach(({ key, value }) => {
      const uri = makeUri(value.type, key);
      const deps = traverseTreeAndMatchValue(value, uriMatcher);

      deps.forEach((dep) => {
        depTable[dep] = depTable[dep] || [];
        depTable[dep].push(uri);
        // TODO: Delete!?
      });
      return depTable;
    });

  two$
    .mapJSONConvenience()
    .map(addType)
    .forEach(({ key, value }) => {
      const uri = makeUri(value.type, key);
      kTable[uri] = value;
      processLog.push(key);
    });

  function makeArticleFromUri(uri: string) {
    const value = kTable[uri];
    if (!value) {
      return null;
    }

    const author = dereference(value.author) || {};
    return {
      ...value,
      author: { ...author, image: dereference(author.image) },
      gallery: (value?.gallery ?? []).map(dereference),
    };
  }

  three$
    .mapJSONConvenience()
    .map(addType)
    // .filter(({ value }) => value.type === 'article')
    .map(({ value, key }) => {
      const uri = makeUri(value.type, key);
      if (value.type === 'article') {
        return makeArticleFromUri(uri);
      } else {
        // TODO: Sends articles too early!
        const roots = findRoots(uri);
        roots.forEach((root) => {
          if (root) {
            console.log('depROOT:', uri, '->', root);
            return makeArticleFromUri(root);
          }
        });
      }
      return null;
    })
    .filter((item) => item)
    .map((value) => ({ key: 'KEY1', value: JSON.stringify(value) }))
    .tap((kv) => console.log('- Sending article', kv.key))
    .to(OUTPUT_TOPIC);

  stream.start().then(() => {
    console.log(`created KStream from "${INPUT_TOPIC}"...`);
  });
}

run();
