import type { GameEngine } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { MovementTrait } from '../engine/composition/MovementTrait'

const states = ['Calf', 'Adolescent', 'Adult', 'Old', 'Dead'] as const

export class Herbivore extends GameEntity {
  layer = RenderLayers.Herbivores
  position
  size
  state = new StateTrait<(typeof states)[number]>(
    this,
    HerbivoreSettings.AgeRandomizationMs
  )
  movement

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.state.age._ms = Math.random() * PlantSettings.AgeRandomizationMs
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(0, 0, this.position)
    this.movement = new MovementTrait(this.position)
    this.state.set('Calf')
  }

  update(deltaMs: number) {
    this.state.update(deltaMs)
    this.movement.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.OrangeLight
    this.size.fillRect(ctx)
  }

  /**
   * Calf state.
   */
  enterStateCalf() {
    this.size.width = 7
    this.size.height = 7
  }

  updateStateCalf() {
    if (this.state.age.ms >= HerbivoreSettings.CalfDurationMs) {
      this.state.set('Adolescent')
    }
  }

  /**
   * Adolescent state.
   */
  enterStateAdolescent() {
    this.grow(HerbivoreSettings.AgeBasedGrowth)
  }

  updateStateAdolescent() {
    if (this.state.age.ms >= HerbivoreSettings.AdolescentDurationMs) {
      this.state.set('Adult')
    }
  }

  /**
   * Adult state.
   */
  enterStateAdult() {
    this.grow(HerbivoreSettings.AgeBasedGrowth)
  }

  updateStateAdult() {
    if (this.state.age.ms >= HerbivoreSettings.AdultDurationMs) {
      this.state.set('Old')
    }
  }

  /**
   * Old state.
   */
  enterStateOld() {
    this.grow(HerbivoreSettings.AgeBasedGrowth)
  }

  updateStateOld() {
    if (this.state.age.ms >= HerbivoreSettings.OldDurationMs) {
      this.state.set('Dead')
    }
  }

  enterStateDead() {
    this.state.set('Calf')
    // this.remove()
  }

  protected grow(amount: number) {
    this.size.width += amount
    this.size.height += amount
  }
}
