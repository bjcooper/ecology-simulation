import type { Vector2D } from '..'

export class SizeTrait {
  size: Vector2D = {
    x: 0,
    y: 0
  }

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  get width() {
    return this.size.x
  }

  set width(_width: number) {
    this.size.x = Math.round(_width)
  }

  get height() {
    return this.size.y
  }

  set height(_height: number) {
    this.size.y = Math.round(_height)
  }
}
