import { nanoId, number, imageUrlFromPlaceIMG } from 'minifaker';

export function genImage({ isProfile }) {
  const width = number({ min: 100, max: 600, float: false });
  const height = number({ min: 100, max: 600, float: false });
  const category = isProfile ? 'people' : 'any';

  return {
    id: nanoId.nanoid(6),
    url: imageUrlFromPlaceIMG({ width, height, category }),
    width,
    height,
  };
}
