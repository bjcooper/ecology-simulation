import { Vector2D } from '..'

export class PositionTrait {
  point: Vector2D

  constructor(x: number, y: number) {
    this.point = new Vector2D(x, y)
  }

  get screenX() {
    return Math.round(this.x)
  }

  get x() {
    return this.point.x
  }

  set x(_x: number) {
    this.point.x = _x
  }

  get screenY() {
    return Math.round(this.y)
  }

  get y() {
    return this.point.y
  }

  set y(_y: number) {
    this.point.y = _y
  }

  distanceTo(other: PositionTrait) {
    return this.point.distanceTo(other.point)
  }

  closest<T extends { position: PositionTrait }>(
    others: T[]
  ): { closest: T | null; distance: number } {
    let closest = null
    let distance = Infinity
    for (const other of others) {
      const otherDistance = this.distanceTo(other.position)
      if (!closest || otherDistance < distance) {
        closest = other
        distance = otherDistance
      }
    }
    return {
      closest,
      distance
    }
  }
}
