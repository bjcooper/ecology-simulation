import type { PositionTrait } from '..'
import { Vector2D } from '..'

export class SizeTrait {
  dimensions = new Vector2D()

  constructor(width: number, height: number, public _position: PositionTrait) {
    this.width = width
    this.height = height
  }

  get width() {
    return this.dimensions.x
  }

  set width(_width: number) {
    this.dimensions.x = Math.round(_width)
  }

  get height() {
    return this.dimensions.y
  }

  set height(_height: number) {
    this.dimensions.y = Math.round(_height)
  }

  get topLeft() {
    return new Vector2D(this.left, this.top)
  }

  get left() {
    return Math.round(this._position.screenX - this.width / 2)
  }

  get right() {
    return Math.round(this._position.screenX + this.width / 2)
  }

  get top() {
    return Math.round(this._position.screenY - this.height / 2)
  }

  get bottom() {
    return Math.round(this._position.screenY + this.height / 2)
  }

  contains(point: Vector2D) {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    )
  }

  overlaps(other: SizeTrait) {
    return (
      this.left <= other.right &&
      this.right >= other.left &&
      this.top <= other.bottom &&
      this.bottom >= other.top
    )
  }

  fillRect(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.left, this.top, this.width, this.height)
  }
}
