export declare function defineProvider<SS>(instance: () => SS): () => SS;

export declare function defineService<Id extends string, SS>(
  id: Id,
  instance: () => SS
): () => SS;

export declare function defineService<
  Id extends string,
  S extends Record<string | number | symbol, any> = {}
>(id: Id, instance: S): () => S;

export declare function defineWorkflow<Id extends string, SS>(
  id: Id,
  instance: () => SS
): () => SS;
