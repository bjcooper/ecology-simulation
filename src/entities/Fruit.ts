import type { Vector2D } from '../engine'
import { PositionTrait, SizeTrait } from '../engine'

export class Fruit {
  position
  size = new SizeTrait(5, 5)

  constructor(position: Vector2D) {
    this.position = new PositionTrait(position, this.size)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Red
    ctx.fillRect(
      this.position.left,
      this.position.top,
      this.size.width,
      this.size.height
    )
  }
}
