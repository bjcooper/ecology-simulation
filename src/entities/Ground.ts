import type { GameEngine } from '../engine'
import { GameEntityBase } from '../engine'

export class Ground extends GameEntityBase {
  x: number

  constructor(game: GameEngine, x: number) {
    super(game)
    this.x = x
  }

  static create(game: GameEngine, x: number) {
    const instance = new this(game, x)
    this.add()
    return instance
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Yellow
    ctx.fillRect(0, 0, this.game.worldSize.width, this.game.worldSize.height)
  }
}
