import { GameEntityBase } from "super-simple-js-game-engine"

export class Stats extends GameEntityBase {
  maxMeasurements = 10
  pastDeltasMs: number[] = []
  averageFps = 0

  update(deltaMs: number) {
    this.pastDeltasMs.unshift(deltaMs)
    if (this.pastDeltasMs.length > this.maxMeasurements) {
      this.pastDeltasMs.pop()
    }
    if (this.pastDeltasMs.length) {
      let ave = 0
      for (const d of this.pastDeltasMs) {
        ave += d
      }
      this.averageFps = Math.round(1000 / (ave / this.pastDeltasMs.length))
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Print frame rate.
    ctx.fillStyle = Color.GrayExtraDark
    ctx.font = `14px ${Font.UI}`
    ctx.textAlign = 'right'
    ctx.fillText(
      `${this.averageFps.toString()} FPS`,
      this.game.worldSize.width - 7,
      this.game.worldSize.height - 12
    )

    // Print entity count.
    ctx.fillText(
      `${this.game.entities.length} entities`,
      this.game.worldSize.width - 7,
      this.game.worldSize.height - 30
    )
  }
}
