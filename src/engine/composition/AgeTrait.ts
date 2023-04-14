export class AgeTrait {
  constructor(public _ms = 0) {}

  get ms() {
    return Math.round(this._ms)
  }

  get seconds() {
    return Math.round(this._ms / 1000)
  }

  update(deltaMs: number) {
    this._ms += deltaMs
  }
}
