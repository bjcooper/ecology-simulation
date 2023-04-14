import type { GameEngine } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'

const states = ['Calf', 'Adolescent', 'Adult', 'Old', 'Dead'] as const

export class Herbivore extends GameEntity {
  layer = RenderLayers.Herbivores
  position
  size
  state = new StateTrait<(typeof states)[number]>(
    this,
    HerbivoreSettings.AgeRandomizationMs
  )

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.state.age._ms = Math.random() * PlantSettings.AgeRandomizationMs
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(15, 15, this.position)

    this.state.set('Calf')
  }

  enterStateCalf() {
    this.size.width = 7
    this.size.height = 7
  }

  updateStateCalf() {
    if (this.state.age.ms >= HerbivoreSettings.CalfDurationMs) {
      this.state.set('Adolescent')
    }
  }

  enterStateAdolescent() {
    this.grow(4)
  }

  updateStateAdolescent() {
    if (this.state.age.ms >= HerbivoreSettings.AdolescentDurationMs) {
      this.state.set('Adult')
    }
  }

  enterStateAdult() {
    this.grow(4)
  }

  updateStateAdult() {
    if (this.state.age.ms >= HerbivoreSettings.AdultDurationMs) {
      this.state.set('Old')
    }
  }

  enterStateOld() {
    this.grow(4)
  }

  updateStateOld() {
    if (this.state.age.ms >= HerbivoreSettings.OldDurationMs) {
      this.state.set('Dead')
    }
  }

  enterStateDead() {
    this.remove()
  }

  update(deltaMs: number) {
    this.state.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.OrangeLight
    this.size.fillRect(ctx)
  }

  protected grow(amount: number) {
    this.size.width += amount
    this.size.height += amount
  }
}
