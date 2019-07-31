function annotation(descriptor) {
  console.log(descriptor);
}

@annotation
class Timer {
  count = 1;
  constructor() {
    this.count = 123;
  }
  start() {
    this.count++;
  }
}

class Counter {
  #xValue = 0;

  get #x() { return this.#xValue; }
  set #x(value) {
    this.#xValue = value;
  }

  #clicked() {
    this.#x++;
  }
}

console.log(new Counter());
console.log(new Timer());
