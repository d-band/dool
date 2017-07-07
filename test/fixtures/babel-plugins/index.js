function * test() {
  yield 1;
  yield 2;
}
async function hello() {
  await Promise.resolve(2);
}
