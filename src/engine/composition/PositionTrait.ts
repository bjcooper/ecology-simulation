import type { Vector2D } from '..'

export class PositionTrait {
  _position: Vector2D

  constructor(x: number, y: number) {
    this._position = {
      x: Math.round(x),
      y: Math.round(y)
    }
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
}
