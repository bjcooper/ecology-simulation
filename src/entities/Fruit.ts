import { hasPosition } from "../../../other/super-simple-game-engine/src/composition/hasPosition"
import { hasSize } from "../../../other/super-simple-game-engine/src/composition/hasSize"
import { Color } from "../constants"

export class Fruit {
  position
  size = hasSize({ x: 5, y: 5 })

  constructor(position: Vector2D) {
    this.position = hasPosition(position, this.size)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Red
    ctx.fillRect(
      this.position.left(),
      this.position.top(),
      this.size.x,
      this.size.y
    )
  }
}
