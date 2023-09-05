function generateBppNumber(prefix: string = 'BPP-'): string {
  const date = new Date();
  const milliseconds = date.getTime();

  return prefix + milliseconds;
}

export { generateBppNumber };
