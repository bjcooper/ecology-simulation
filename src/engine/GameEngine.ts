import type { IGameEntity } from '.'
import { PositionTrait } from './composition/PositionTrait'
import { SizeTrait } from './composition/SizeTrait'

export class GameEngine {
  protected isPaused = true
  protected lastRenderMs = 0
  protected ctx: CanvasRenderingContext2D
  entities: IGameEntity[] = []
  screenSize

  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.screenSize = new SizeTrait(
      this.canvas.width,
      this.canvas.height,
      new PositionTrait(this.canvas.width / 2, this.canvas.height / 2)
    )
    this.step(0)
  }

  /**
   * Pause game play.
   */
  public pause() {
    this.isPaused = true
  }

  /**
   * Start or resume game play.
   */
  public play() {
    this.isPaused = false
  }

  /**
   * The program loop.
   */
  protected step(timeMs: DOMHighResTimeStamp) {
    const deltaMs = timeMs - this.lastRenderMs
    if (!this.isPaused) {
      // Update loop.
      for (const entity of this.entities) {
        if (entity.update) {
          entity.update(deltaMs)
        }
      }

      // Draw loop.
      this.ctx.clearRect(0, 0, this.screenSize.width, this.screenSize.height)
      for (const entity of this.entities) {
        if (entity.draw) {
          entity.draw(this.ctx)
        }
      }
    }
    this.lastRenderMs = timeMs
    requestAnimationFrame(time => this.step(time))
  }

  /**
   * Regiser a new entity.
   */
  public registerEntity(entity: IGameEntity) {
    if (this.entities.length >= 2000) {
      return
    }
    this.entities.push(entity)
  }

  /**
   * Unregister an existing entity.
   */
  public unregisterEntity(entity: IGameEntity) {
    const index = this.entities.indexOf(entity)
    if (index >= 0) {
      this.entities.splice(index, 1)
    }
  }
}
