import { GameEntityBase } from "../../../other/super-simple-game-engine/src/GameEntityBase"
import { Color } from "../constants"

export class Ground extends GameEntityBase implements GameEntity {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Yellow
    ctx.fillRect(0, 0, this.game.worldSize.x, this.game.worldSize.y)
  }
}
