import type { IGameEntity } from '.'
import { PositionTrait } from './composition/PositionTrait'
import { SizeTrait } from './composition/SizeTrait'

export class GameEngine {
  protected isPaused = true
  protected lastUpdateMs = 0
  protected lastDrawMs = 0
  protected ctx: CanvasRenderingContext2D
  protected nextId = 0
  maxEntities = 2000
  drawRateMs = Math.ceil(1000 / 30)
  entities: IGameEntity[] = []
  screenSize

  constructor(
    protected canvas: HTMLCanvasElement,
    options?: {
      maxEntities: number
      drawRateMs: number
    }
  ) {
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.screenSize = new SizeTrait(
      this.canvas.width,
      this.canvas.height,
      new PositionTrait(this.canvas.width / 2, this.canvas.height / 2)
    )

    if (options && options.maxEntities) {
      this.maxEntities = options.maxEntities
    }
    if (options && options.drawRateMs) {
      this.drawRateMs = options.drawRateMs
    }

    this.step(0)
  }

  /**
   * Pause game play.
   */
  pause() {
    this.isPaused = true
  }

  /**
   * Start or resume game play.
   */
  play() {
    this.isPaused = false
  }

  /**
   * Generate a new entity ID.
   */
  newId() {
    this.nextId++
    return this.nextId
  }

  /**
   * Get an entity with the given ID.
   */
  entity(id: number) {
    return this.entities.find(entity => entity.id === id)
  }

  /**
   * The program loop.
   */
  protected step(timeMs: DOMHighResTimeStamp) {
    if (!this.isPaused) {
      // Update loop.
      const updateDeltaMs = timeMs - this.lastUpdateMs
      for (const entity of this.entities) {
        if (entity.update) {
          entity.update(updateDeltaMs)
        }
      }
      this.lastUpdateMs = timeMs

      // Draw loop.
      const drawDeltaMs = timeMs - this.lastDrawMs
      if (drawDeltaMs >= this.drawRateMs) {
        this.ctx.clearRect(0, 0, this.screenSize.width, this.screenSize.height)
        for (const entity of this.entities) {
          if (entity.draw) {
            entity.draw(this.ctx)
          }
        }
        this.lastDrawMs = timeMs
      }
    }
    requestAnimationFrame(time => this.step(time))
  }

  /**
   * Regiser a new entity.
   */
  public registerEntity(entity: IGameEntity) {
    if (this.entities.length >= this.maxEntities) {
      return
    }
    this.entities.push(entity)
    this.entities.sort((a, b) => {
      return a.layer - b.layer
    })
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
