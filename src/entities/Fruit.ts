import type { PositionTrait } from '../engine'
import { SizeTrait } from '../engine'

export class Fruit {
  size

  constructor(position: PositionTrait) {
    this.size = new SizeTrait(5, 5, position)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Purple
    this.size.fillRect(ctx)
  }
}
