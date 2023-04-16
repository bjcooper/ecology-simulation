import { HealthTrait } from '../composition/HealthTrait'
import { HungerTrait } from '../composition/HungerTrait'
import type { GameEngine } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { MovementTrait } from '../engine/composition/MovementTrait'
import { rollChance } from '../engine/utils'

export const AnimalStates = [
  'Calf',
  'Adolescent',
  'Adult',
  'Old',
  'Dead'
] as const

export class Herbivore extends GameEntity {
  layer = RenderLayers.Herbivores
  position
  size
  state = new StateTrait<(typeof AnimalStates)[number]>(
    this,
    HerbivoreSettings.AgeRandomizationMs
  )
  health = new HealthTrait()
  hunger = new HungerTrait(0)
  movement

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.state.age._ms = Math.random() * PlantSettings.AgeRandomizationMs
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(0, 0, this.position)
    this.movement = new MovementTrait(this.position)
    this.state.set('Calf')
  }

  get isAdult() {
    return (
      this.state.currentState &&
      AnimalStates.indexOf(this.state.currentState) >=
        AnimalStates.indexOf('Adult')
    )
  }

  update(deltaMs: number) {
    // Apply hunger.
    this.hunger.update(deltaMs)
    if (this.hunger.isStarving) {
      this.health.damage(GeneralSettings.Hunger.StarvationDamagePerMs)
    } else if (!this.hunger.isHungry) {
      this.health.heal(GeneralSettings.Hunger.SatedHealingPerMs)
    }

    // Apply state.
    this.state.update(deltaMs)

    // Apply health.
    if (this.health.isDead) {
      this.state.set('Dead')
    }

    // Apply movement.
    this.movement.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.OrangeLight
    this.size.fillRect(ctx)
  }

  protected grow(amount: number) {
    this.size.width += amount
    this.size.height += amount
  }

  /**
   * Calf state.
   */
  enterStateCalf() {
    this.size.width = 7
    this.size.height = 7
    this.health.max = HerbivoreSettings.Calf.Health
    this.hunger.maxMs = HerbivoreSettings.Calf.MaxHungerMs
    this.hunger.currentMs = 0
  }

  updateStateCalf() {
    // Find the closest adult.
    const { closest: closestAdult, distance: closestAdultDistance } =
      this.position.closest(
        this.game.entities.filter(
          x => x instanceof Herbivore && x.isAdult
        ) as Herbivore[]
      )
    if (closestAdult) {
      // If we're not close enough to the adult, move toward it.
      if (
        closestAdultDistance > HerbivoreSettings.Calf.PreferredDistanceToAdult
      ) {
        this.movement.moveToward(
          closestAdult.position,
          HerbivoreSettings.Calf.RunSpeedPerSec
        )
      }
      // If we are close enough, try to nurse.
      else if (
        rollChance(HerbivoreSettings.Calf.NurseChancePerMs * this.state.deltsMs)
      ) {
        this.hunger.eat(HerbivoreSettings.Calf.NurseFoodPerMs)
      }
    }
    // If we can't find an adult, stand still.
    else {
      this.movement.stop()
    }

    // Become an adolescent at the designated age.
    if (this.state.age.ms >= HerbivoreSettings.Calf.AgeDurationMs) {
      this.state.set('Adolescent')
    }
  }

  /**
   * Adolescent state.
   */
  enterStateAdolescent() {
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
    this.movement.speedPerSec = 0
  }

  updateStateAdolescent() {
    if (this.state.age.ms >= HerbivoreSettings.Adolescent.AgeDurationMs) {
      this.state.set('Adult')
    }
  }

  /**
   * Adult state.
   */
  enterStateAdult() {
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  updateStateAdult() {
    if (this.state.age.ms >= HerbivoreSettings.Adult.AgeDurationMs) {
      this.state.set('Old')
    }
  }

  /**
   * Old state.
   */
  enterStateOld() {
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  updateStateOld() {
    if (this.state.age.ms >= HerbivoreSettings.Old.AgeDurationMs) {
      this.state.set('Dead')
    }
  }

  enterStateDead() {
    console.log('died')
    this.remove()
  }
}
