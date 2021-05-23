export const mathHelper = (a: number, b: number, op: string): number => {
  const num = internalHelper(2);
  if (op === 'add') {
    return a + b + num;
  }
  if (op === 'sub') {
    return a - b + num;
  }
  return a + b + num;
};

const internalHelper = (num: number) => {
  console.log('hiiiiiii');
  return num + 2;
};
