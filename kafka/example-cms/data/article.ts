import { uuid, arrayElement, word } from 'minifaker';

const sentence = (n: number) => Array.from({ length: n }).map(word).join(' ');
const range = (n: number): number[] =>
  Array.from({ length: n }).map((_v, k) => k);
const randRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(randRange(min, max));

export function genArticle({ authorIds, imagesIds }) {
  return {
    id: uuid.v4(),
    title: sentence(5),
    author: `hearst://author/${arrayElement(authorIds)}`,
    gallery: range(5)
      .map(() => arrayElement(imagesIds))
      .map((id) => `hearst://image/${id}`),
    body: range(10).map(() => ({
      paragraph: sentence(randInt(0, 100)),
    })),
  };
}
