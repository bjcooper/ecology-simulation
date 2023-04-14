import { GameEntity } from '../engine'

export class Ground extends GameEntity {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Yellow
    ctx.fillRect(0, 0, this.game.worldSize.width, this.game.worldSize.height)
  }
}
