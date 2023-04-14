import type { Vector2D } from '..'

export class PositionTrait {
  position: Vector2D

  constructor(x: number, y: number) {
    this.position = {
      x: Math.round(x),
      y: Math.round(y)
    }
  }

  get x() {
    return this.position.x
  }

  set x(_x: number) {
    this.position.x = Math.round(_x)
  }

  get y() {
    return this.position.y
  }

  set y(_y: number) {
    this.position.y = Math.round(_y)
  }
}
