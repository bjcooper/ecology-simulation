import type { GameEngine } from './GameEngine'

export { GameEngine } from './GameEngine'
export { GameEntityBase } from './GameEntityBase'
export { AgeTrait } from './composition/AgeTrait'
export { PositionTrait } from './composition/PositionTrait'
export { SizeTrait } from './composition/SizeTrait'
export { StateTrait } from './composition/StateTrait'

export type UpdateCallback = (deltaMs: number) => void

export type DrawCallback = (ctx: CanvasRenderingContext2D) => void

export interface GameEntity {
  game: GameEngine
  remove: () => void
  update?: UpdateCallback
  draw?: DrawCallback
}

export type Vector2D = {
  x: number
  y: number
}

export type BoundingBoxInfo = {
  top: () => number
  bottom: () => number
  left: () => number
  right: () => number
}
