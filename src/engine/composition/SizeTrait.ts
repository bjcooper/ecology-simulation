import type { Vector2D } from '..'

export class SizeTrait {
  size: Vector2D

  constructor(initialSize: Vector2D) {
    this.size = {
      x: 0,
      y: 0
    }
    this.width = initialSize.x
    this.height = initialSize.y
  }

  static use(initialSize: Vector2D) {
    return new SizeTrait(initialSize)
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

  matches(other: Vector2D) {
    return this.size.x === other.x && this.size.y === other.y
  }
}
