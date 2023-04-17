import type { GameEntity } from '../engine'
import { FoodTrait } from './FoodTrait'

export class HungerTrait {
  /**
   * It's convenient to measure hunger in milliseconds, which is essentially
   * saying how many milliseconds a piece of food will add to the time until an
   * organism is starving.
   */
  currentMs: number
  protected _maxMs: number

  constructor(public owner: GameEntity, max: number, current?: number) {
    this._maxMs = max
    this.currentMs = current === undefined ? 0 : current
  }

  get maxMs() {
    return this._maxMs
  }

  set maxMs(maxMs: number) {
    this._maxMs = maxMs
    this.currentMs = Math.min(this.currentMs, this.maxMs)
  }

  get percent() {
    if (this._maxMs <= 0) {
      return 1
    }
    return this.currentMs / this._maxMs
  }

  get isHungry() {
    return this.percent >= GeneralSettings.Hunger.HungerThresholdPercent
  }

  get isSated() {
    return !this.isHungry
  }

  get isStarving() {
    return this.currentMs === this._maxMs
  }

  update(deltaMs: number) {
    this.currentMs = Math.min(this._maxMs, this.currentMs + deltaMs)
  }

  eat(food?: FoodTrait | number) {
    const amountMs =
      food instanceof FoodTrait
        ? food.eat(this.owner)
        : food === undefined
        ? this._maxMs
        : food
    this.currentMs = Math.max(0, this.currentMs - amountMs)
    return amountMs
  }
}
