export class Fruit {
  position
  size = SizeTrait.use({ x: 5, y: 5 })

  constructor(position: Vector2D) {
    this.position = PositionTrait.use(position, this.size)
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
