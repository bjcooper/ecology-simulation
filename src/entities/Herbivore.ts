import { HealthTrait } from '../composition/HealthTrait'
import { HungerTrait } from '../composition/HungerTrait'
import type { GameEngine } from '../engine'
import { Vector2D } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { MovementTrait } from '../engine/composition/MovementTrait'
import { Plant } from './Plant'

export const HerbivoreAges = [
  'Calf',
  'Adolescent',
  'Adult',
  'Old',
  'Dead'
] as const

export type HerbivoreAge = (typeof HerbivoreAges)[number]

export const HerbivoreBehaviors = [
  'SeekAdult',
  'Nurse',
  'SeekFood',
  'Eat',
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
    return closest
      ? {
          entity: closest,
          distance
        }
      : null
  }

  get closestPlant() {
    const { closest, distance } = this.position.closest(
      this.game.entities.filter(
        plant => plant instanceof Plant && plant.eatable
      ) as Plant[]
    )
    return closest
      ? {
          entity: closest,
          distance
        }
      : null
  }

  add() {
    // Spawn with full health.
    this.health.current = this.health.max
    super.add()
  }

  update(deltaMs: number) {
    // Apply hunger.
    this.hunger.update(deltaMs)
    if (this.hunger.isStarving) {
      this.health.damage(GeneralSettings.Hunger.StarvationDamagePerMs * deltaMs)
    } else if (!this.hunger.isHungry) {
      this.health.heal(GeneralSettings.Hunger.SatedHealingPerMs * deltaMs)
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
    this.ageState.next('Adolescent', HerbivoreSettings.Calf.AgeDurationMs)
    this.size.width = 7
    this.size.height = 7
    this.health.max = HerbivoreSettings.Calf.Health
    this.hunger.maxMs = HerbivoreSettings.Calf.MaxHungerMs
    this.behaviorState.set('SeekAdult')
  }

  enterStateAdolescent() {
    this.ageState.next('Adult', HerbivoreSettings.Adolescent.AgeDurationMs)
    this.health.max = HerbivoreSettings.Adolescent.Health
    this.hunger.maxMs = HerbivoreSettings.Adolescent.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
    this.behaviorState.set('Wander')
  }

  enterStateAdult() {
    this.ageState.next('Old', HerbivoreSettings.Adult.AgeDurationMs)
    this.health.max = HerbivoreSettings.Adult.Health
    this.hunger.maxMs = HerbivoreSettings.Adult.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  enterStateOld() {
    this.ageState.next('Dead', HerbivoreSettings.Old.AgeDurationMs)
    this.health.max = HerbivoreSettings.Old.Health
    this.hunger.maxMs = HerbivoreSettings.Old.MaxHungerMs
    this.grow(HerbivoreSettings.AgeBasedSizeGrowth)
  }

  enterStateDead() {
    this.behaviorState.set('Die')
  }

  /**
   * Behavior states.
   */

  updateStateSeekAdult() {
    // If we grow up while seeking adult, start wandering.
    if (this.ageState.currentState !== 'Calf') {
      this.behaviorState.set('Wander')
      return
    }

    // Find the closest adult.
    if (this.closestAdult) {
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
      return
    }

    // If we can't find an adult, freeze.
    this.movement.stop()
  }

  updateStateNurse() {
    // Find the closest adult. If we're close enough, attempt to nurse.
    if (
      this.closestAdult &&
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
    // When we're no longer hungry, stop seeking food.
    if (!this.hunger.isHungry) {
      this.behaviorState.set('Wander')
      return
    }

    // Find the closest plant.
    if (this.closestPlant) {
      // If we're touching it, eat it.
      if (this.size.overlaps(this.closestPlant.entity.size)) {
        this.behaviorState.set('Eat')
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

  updateStateEat() {
    // If the plant we're eating is gone, go back to looking.
    if (!this.closestPlant?.entity.eatable) {
      this.behaviorState.set('SeekFood')
      return
    }

    // Once we've finished eating, consume the plant and go back to wandering.
    if (this.behaviorState.age.ms >= HerbivoreSettings.EatDurationMs) {
      this.hunger.eat(this.closestPlant.entity.eatable)
      this.behaviorState.set('Wander')
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
