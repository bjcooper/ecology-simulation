import type { GameEngine } from './GameEngine'

export { GameEngine } from './GameEngine'
export { GameEntity } from './GameEntity'
export { AgeTrait } from './composition/AgeTrait'
export { PositionTrait } from './composition/PositionTrait'
export { SizeTrait } from './composition/SizeTrait'
export { StateTrait } from './composition/StateTrait'

export type UpdateCallback = (deltaMs: number) => void

export type DrawCallback = (ctx: CanvasRenderingContext2D) => void

export interface IGameEntity {
  layer: number
  game: GameEngine
  remove: () => void
  update?: UpdateCallback
  draw?: DrawCallback
}

export class Vector2D {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Return a unit vector.
   */
  get unit() {
    const magnitude = this.x + this.y
    if (magnitude === 0) {
      return new Vector2D(0, 0)
    }
    return new Vector2D(this.x / magnitude, this.y / magnitude)
  }
}
