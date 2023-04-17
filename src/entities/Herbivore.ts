import { HealthTrait } from '../composition/HealthTrait'
import { HungerTrait } from '../composition/HungerTrait'
import type { GameEngine } from '../engine'
import { Vector2D } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { MovementTrait } from '../engine/composition/MovementTrait'
import { Plant } from './Plant'

export const HerbivoreAges = ['Calf', 'Adolescent', 'Adult', 'Old'] as const

export type HerbivoreAge = (typeof HerbivoreAges)[number]

export const HerbivoreBehaviors = [
  'SeekAdult',
  'Nurse',
  'SeekFood',
  'Wander',
  'Die'
] as const

export type HerbivoreBehavior = (typeof HerbivoreBehaviors)[number]

export class Herbivore extends GameEntity {
  layer = RenderLayers.Herbivores
  position
  size
  movement
  ageState = new StateTrait<HerbivoreAge>(
    this,
    HerbivoreSettings.AgeRandomizationMs
  )
  behaviorState = new StateTrait<HerbivoreBehavior>(this)
  health = new HealthTrait()
  hunger = new HungerTrait(this, 0)

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.ageState.age._ms = Math.random() * PlantSettings.AgeRandomizationMs
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(0, 0, this.position)
    this.movement = new MovementTrait(this.position)
    this.ageState.set('Calf')
  }

  get isAdult() {
    return (
      this.ageState.currentState &&
      HerbivoreAges.indexOf(this.ageState.currentState) >=
        HerbivoreAges.indexOf('Adult')
    )
  }

  get closestAdult() {
    const { closest, distance } = this.position.closest(
      this.game.entities.filter(
        other => other instanceof Herbivore && other.isAdult
      ) as Herbivore[]
    )
    return {
      entity: closest,
      distance
    }
  }

  get closestPlant() {
    const { closest, distance } = this.position.closest(
      this.game.entities.filter(
        plant => plant instanceof Plant && plant.asFood.isEdible
      ) as Plant[]
    )
    return {
      entity: closest,
      distance
    }
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
    this.ageState.update(deltaMs)
    this.behaviorState.update(deltaMs)

    // Apply health.
    if (this.health.isDead) {
      console.log('Died of starvation')
      this.behaviorState.set('Die')
    }

    // Apply movement.
    this.movement.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.OrangeLight
    this.size.fillRect(ctx)
  }

  /**
   * Age states.
   */

  enterStateCalf() {
    this.size.width = 7
    this.size.height = 7
    this.health.max = HerbivoreSettings.Calf.Health
    this.hunger.maxMs = HerbivoreSettings.Calf.MaxHungerMs
    this.behaviorState.set('SeekAdult')
  }

  updateStateCalf() {
    if (this.ageState.age.ms >= HerbivoreSettings.Calf.AgeDurationMs) {
      this.ageState.set('Adolescent')
    }
  }

  enterStateAdolescent() {
    this.health.max = HerbivoreSettings.Adolescent.Health
    this.hunger.maxMs = HerbivoreSettings.Adolescent.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
    this.behaviorState.set('Wander')
  }

  updateStateAdolescent() {
    if (this.ageState.age.ms >= HerbivoreSettings.Adolescent.AgeDurationMs) {
      this.ageState.set('Adult')
    }
  }

  enterStateAdult() {
    this.health.max = HerbivoreSettings.Adult.Health
    this.hunger.maxMs = HerbivoreSettings.Adult.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  updateStateAdult() {
    if (this.ageState.age.ms >= HerbivoreSettings.Adult.AgeDurationMs) {
      this.ageState.set('Old')
    }
  }

  enterStateOld() {
    this.health.max = HerbivoreSettings.Old.Health
    this.hunger.maxMs = HerbivoreSettings.Old.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  updateStateOld() {
    if (this.ageState.age.ms >= HerbivoreSettings.Old.AgeDurationMs) {
      console.log('Died of old age')
      this.behaviorState.set('Die')
    }
  }

  /**
   * Behavior states.
   */

  updateStateSeekAdult() {
    // Find the closest adult.
    if (this.closestAdult.entity) {
      // If we're not close enough to the adult, move toward it.
      if (
        this.closestAdult.distance >
        HerbivoreSettings.Calf.PreferredDistanceToAdult
      ) {
        this.movement.moveToward(
          this.closestAdult.entity.position,
          HerbivoreSettings.Calf.RunSpeedPerSec
        )
      } else {
        this.behaviorState.set('Nurse')
      }
    }
    // If we can't find an adult, freeze.
    else {
      this.movement.stop()
    }
  }

  updateStateNurse() {
    // Find the closest adult. If we're close enough, attempt to nurse.
    if (
      this.closestAdult.entity &&
      this.closestAdult.distance <=
        HerbivoreSettings.Calf.PreferredDistanceToAdult
    ) {
      // When we've nursed long enough, fill up and go back to seeking.
      if (
        this.behaviorState.age.ms >= HerbivoreSettings.Calf.NursingDurationMs
      ) {
        this.hunger.eat()
        this.behaviorState.set('SeekAdult')
      }
    } else {
      this.behaviorState.set('SeekAdult')
    }
  }

  updateStateSeekFood() {
    // Find the closest plant.
    if (this.closestPlant.entity) {
      // If we're touching it, eat it.
      if (this.size.overlaps(this.closestPlant.entity.size)) {
        this.hunger.eat(this.closestPlant.entity.asFood)
        console.log('eat!', this.hunger.percent)
      }
      // Otherwise, walk toward it.
      else {
        this.movement.moveToward(
          this.closestPlant.entity.position,
          HerbivoreSettings.WalkSpeedPerSec
        )
      }
    }
  }

  enterStateWander() {
    // Pick a random location to walk toward.
    this.movement.moveToward(
      new Vector2D(
        this.game.screenSize.width * Math.random(),
        this.game.screenSize.height * Math.random()
      ),
      HerbivoreSettings.WanderSpeedPerSec
    )
  }

  updateStateWander() {
    if (this.hunger.isHungry) {
      console.log('hungry')
      this.behaviorState.set('SeekFood')
    }
  }

  updateStateDie() {
    this.remove()
  }

  protected grow(amount: number) {
    this.size.width += amount
    this.size.height += amount
  }
}
