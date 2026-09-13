export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? number
    : T[K] extends Date | null
      ? number | null
      : T[K] extends Date | undefined
        ? number | undefined
        : T[K] extends Date | null | undefined
          ? number | null | undefined
          : T[K];
};

export interface ISerializer<T, S = Serialized<T>> {
  serialize(value: T): S;
  deserialize(raw: S): T;
}
