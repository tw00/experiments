import assert from 'assert';
import { traverseTreeAndMatchValue } from './utils';

const arrayCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function testTraverseUtils() {
  const object = {
    foo: 1,
    bar: {
      x: 'hearst://foo',
      y: '',
      z: null,
      obj: [{ a: 'hearst://bar' }, 'hearst://array'],
    },
  };

  const list = traverseTreeAndMatchValue(
    object,
    (v) => typeof v === 'string' && v.startsWith('hearst://'),
  );

  const ref = ['hearst://foo', 'hearst://bar', 'hearst://array2'];
  assert(
    arrayCompare(list, ref),
    `test failed [${list}] does not match [${ref}]`,
  );
}

if (require.main === module) {
  try {
    testTraverseUtils();
    console.log('✅ success');
  } catch (e) {
    console.log('❌', e.message);
  }
}
