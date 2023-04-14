import type { BoundingBoxInfo, Vector2D } from '..'
import type { SizeTrait } from './SizeTrait'

export class PositionTrait {
  private _position: Vector2D
  private _size: SizeTrait

  constructor(initialPosition: Vector2D, size: SizeTrait) {
    this._position = {
      x: Math.round(initialPosition.x),
      y: Math.round(initialPosition.y)
    }
    this._size = size
  }

  static use(initialPosition: Vector2D, size: SizeTrait) {
    return new PositionTrait(initialPosition, size)
  }

  get x() {
    return this._position.x
  }

  set x(_x: number) {
    this._position.x = Math.round(_x)
  }

  get y() {
    return this._position.y
  }

  set y(_y: number) {
    this._position.y = Math.round(_y)
  }

  get topLeft() {
    return {
      x: this.left,
      y: this.top
    }
  }

  get left() {
    return Math.round(this.x - this._size.width / 2)
  }

  get right() {
    return Math.round(this.x + this._size.width / 2)
  }

  get top() {
    return Math.round(this.y - this._size.height / 2)
  }

  get bottom() {
    return Math.round(this.y + this._size.height / 2)
  }

  contains(point: Vector2D) {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    )
  }

  overlaps(other: BoundingBoxInfo) {
    return (
      this.left <= other.right() &&
      this.right >= other.left() &&
      this.top <= other.bottom() &&
      this.bottom >= other.top()
    )
  }

  fillRect(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.left, this.top, this._size.width, this._size.height)
  }
}
