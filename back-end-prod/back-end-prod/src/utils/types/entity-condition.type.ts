export type EntityFilterValues<T> = {
  [P in keyof T]?: T[P] | T[P][] | undefined;
};
