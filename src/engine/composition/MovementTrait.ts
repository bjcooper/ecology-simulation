import { Vector2D } from '..'
import { milliseconds } from '../utils'
import type { PositionTrait } from './PositionTrait'

export class MovementTrait {
  speedPerSec = 0
  direction = new Vector2D(0, 0)

  constructor(public _position: PositionTrait) {}

  update(deltaMs: number) {
    const deltaSec = milliseconds(deltaMs).sec
    this._position.x += this.direction.unit.x * (this.speedPerSec * deltaSec)
    this._position.y += this.direction.unit.y * (this.speedPerSec * deltaSec)
  }

  stop() {
    this.direction.x = 0
    this.direction.y = 0
  }

  moveToward(target: Vector2D | PositionTrait, speedPerSec?: number) {
    const point = target instanceof Vector2D ? target : target.point
    this.direction.x = point.x - this._position.x
    this.direction.y = point.y - this._position.y

    if (speedPerSec !== undefined) {
      this.speedPerSec = speedPerSec
    }
  }
}
