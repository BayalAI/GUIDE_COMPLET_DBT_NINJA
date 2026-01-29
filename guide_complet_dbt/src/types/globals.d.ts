// Extend Array prototype for utility methods
declare global {
  interface Array<T> {
    takeWhile(callback: (value: T, index: number, array: T[]) => boolean): T[]
  }
}

export {}
