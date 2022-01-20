import 'minifaker/locales/en';

import { genArticle } from './article';
import { genAuthor } from './author';
import { genImage } from './image';

const forN = <T>(n: number, callback: () => T) =>
  Array.from({ length: n }).map(callback);
const getIds = (list: unknown[]): string[] => list.map((item) => item['id']);

export function genData(N = 10) {
  const images = forN(N, () => genImage({ isProfile: false }));
  const profileImages = forN(N, () => genImage({ isProfile: true }));
  const profileImagesIds = getIds(profileImages);
  const imagesIds = getIds(images);
  const authors = forN(N, () => genAuthor({ profileImagesIds }));
  const authorIds = getIds(authors);
  const articles = forN(N, () => genArticle({ authorIds, imagesIds }));

  return {
    images,
    authors,
    articles,
  };
}
