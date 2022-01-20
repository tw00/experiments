type TCallback = (k: string, v: unknown) => void;
type TMatcher = (v: unknown) => boolean;

export function traverseTree(object: unknown, cb: TCallback) {
  if (!object || typeof object !== 'object') {
    return;
  }

  Object.keys(object).forEach((k) => {
    cb(k, object[k]);
    traverseTree(object[k], cb);
  });
}

export function traverseTreeAndMatchValue<T extends string>(
  object: unknown,
  matcher: TMatcher,
): T[] {
  const list: T[] = [];
  traverseTree(object, (_k, v) => matcher(v) && list.push(v as T));
  return list;
}
