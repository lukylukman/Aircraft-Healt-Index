export class ObjectUtil<T> {
  convertToSnakeCase(input): T {
    if (typeof input !== 'object' || input === null) {
      return input;
    }

    const snakeCaseObject = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const snakeCaseKey = key.replace(
          /[A-Z]/g,
          (match) => `_${match.toLowerCase()}`
        );
        snakeCaseObject[snakeCaseKey] = this.convertToSnakeCase(input[key]);
      }
    }

    return snakeCaseObject as T;
  }
}
