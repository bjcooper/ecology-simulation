import { Vector2D } from '..'
import type { PositionTrait } from './PositionTrait'

export class MovementTrait {
  _speedSec = 0
  _direction = new Vector2D(0, 0)

  constructor(public _position: PositionTrait) {}

  update(deltaMs: number) {
    const deltaSec = deltaMs / 1000
    this._position.position.x +=
      this._direction.unit.x * this._speedSec * deltaSec

    this._position.position.y +=
      this._direction.unit.y * this._speedSec * deltaSec
  }
}
