import { GameEntityBase } from "super-simple-js-game-engine"
export class Ground extends GameEntityBase {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Yellow
    ctx.fillRect(0, 0, this.game.worldSize.width, this.game.worldSize.height)
  }
}
