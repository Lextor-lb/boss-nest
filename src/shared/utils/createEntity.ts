export function createEntity<T>(
  Entity: new (partial: Partial<T>) => T,
  partial?: Partial<T>,
): T | undefined {
  return partial ? new Entity(partial) : undefined;
}

export function createEntityArray<T>(
  Entity: new (partial: Partial<T>) => T,
  partialArray?: Partial<T>[],
): T[] {
  return partialArray ? partialArray.map((partial) => new Entity(partial)) : [];
}
