import { GameEntity } from '../engine'

export class Ground extends GameEntity {
  layer = RenderLayers.Ground

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.GrayExtraLight
    ctx.fillRect(0, 0, this.game.screenSize.width, this.game.screenSize.height)
  }
}
