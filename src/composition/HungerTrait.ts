export class HungerTrait {
  /**
   * It's convenient to measure hunger in milliseconds, which is essentially
   * saying how many milliseconds a piece of food will add to the time until an
   * organism is starving.
   */
  currentMs: number
  maxMs: number

  constructor(max: number, current?: number) {
    this.maxMs = max
    this.currentMs = current === undefined ? 0 : current
  }

  get percent() {
    if (this.maxMs <= 0) {
      return 1
    }
    return this.currentMs / this.maxMs
  }

  get isHungry() {
    return this.percent >= GeneralSettings.Hunger.HungerThresholdPercent
  }

  get isSated() {
    return !this.isHungry
  }

  get isStarving() {
    return this.currentMs === this.maxMs
  }

  update(deltaMs: number) {
    this.currentMs = Math.min(
      this.maxMs,
      this.currentMs + GeneralSettings.Hunger.RateMs * deltaMs
    )
  }

  eat(amount: number) {
    this.currentMs = Math.max(0, this.currentMs - amount)
  }
}
