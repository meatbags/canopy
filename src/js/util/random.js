/** Seeded random number utils */

class Random {
  constructor(seed) {
    this.seed = seed || 0;
    this._random = new Math.seedrandom(this.seed);
  }

  random() {
    return this._random();
  }

  range(a, b) {
    return a + (b - a) * this._random();
  }
}

export default Random;
