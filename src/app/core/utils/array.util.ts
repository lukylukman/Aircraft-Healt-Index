export class ArrayUtil {
  isDuplicate<T>(array: T[], uniqueField: string): boolean {
    const hasDuplicates = array.some((item, index) => {
      return array.slice(index + 1).some((otherItem) => {
        return item[uniqueField] === otherItem[uniqueField];
      });
    });
    console.log(array);
    return hasDuplicates;
  }
}
