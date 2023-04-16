export class Vector2D {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  /**
   * Return a unit vector representing the direction from (0, 0) to (x, y).
   */
  get unit() {
    const total = Math.abs(this.x) + Math.abs(this.y)
    if (total === 0) {
      return new Vector2D(0, 0)
    }
    return new Vector2D(this.x / total, this.y / total)
  }

  /**
   * Find the distance between to points.
   */
  distanceTo(other: Vector2D) {
    return Math.sqrt(
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2)
    )
  }
}
