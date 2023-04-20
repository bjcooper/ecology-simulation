import type { GameEntity } from '../engine'

export class FoodTrait {
  constructor(
    public valueMs: number,
    public onEatenCallback?: (eater: GameEntity) => void
  ) {}

  get isNutritious() {
    return this.valueMs > 0
  }

  eat(eater: GameEntity) {
    if (this.onEatenCallback) {
      this.onEatenCallback(eater)
    }
    return this.valueMs
  }
}
