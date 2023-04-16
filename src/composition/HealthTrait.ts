export class HealthTrait {
  current: number
  max: number

  constructor(max?: number, current?: number) {
    this.max = max === undefined ? 0 : max
    this.current = current === undefined ? this.max : current
  }

  get isDead() {
    return this.current === 0
  }

  heal(amount: number) {
    this.current = Math.min(this.max, this.current + amount)
  }

  damage(amount: number) {
    this.current = Math.max(0, this.current - amount)
  }
}
