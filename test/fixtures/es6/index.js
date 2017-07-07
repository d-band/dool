
class Model {
  constructor() {}
}

class User extends Model {
  constructor() {
    super();
    this.sayHello();
  }

  sayHello() {
    console.log("Hello World!");
  }
}

import B from './b';

console.log(B);

console.log(require('./a'));

new User();

// es2016
let cubed = 2 ** 3;
// es2017
async function foo() {
  await bar();
}
