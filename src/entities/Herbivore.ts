import { HealthTrait } from '../composition/HealthTrait'
import { HungerTrait } from '../composition/HungerTrait'
import type { GameEngine } from '../engine'
import { AgeTrait } from '../engine'
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
  'SeekMate',
  'Mate',
  'Wander',
  'Die'
] as const

export type HerbivoreBehavior = (typeof HerbivoreBehaviors)[number]

export class Herbivore extends GameEntity {
  layer = RenderLayers.Herbivores
  position
  size
  movement
  pregnancy?: AgeTrait
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

  get isFertile() {
    return !this.pregnancy && this.ageState.currentState === 'Adult'
  }

  get mom() {
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

  get plant() {
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

  get mate() {
    const { closest, distance } = this.position.closest(
      this.game.entities.filter(
        other =>
          other instanceof Herbivore &&
          other.behaviorState.currentState === 'SeekMate'
      ) as Herbivore[]
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

    // Update pregnancy timer.
    if (this.pregnancy) {
      this.pregnancy.update(deltaMs)
      if (this.pregnancy.ms >= HerbivoreSettings.PregnancyDurationMs) {
        this.pregnancy = undefined
        for (let i = 0; i < 2; i++) {
          const calf = new Herbivore(
            this.game,
            this.position.x,
            this.position.y
          )
          calf.ageState.set('Calf')
          calf.add()
        }
      }
    }
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
    if (this.mom) {
      // If we're not close enough to the adult, move toward it.
      if (this.mom.distance > HerbivoreSettings.Calf.PreferredDistanceToAdult) {
        this.movement.moveToward(
          this.mom.entity.position,
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

  enterStateNurse() {
    this.movement.stop()
  }

  updateStateNurse() {
    // Find the closest adult. If we're close enough, attempt to nurse.
    if (
      this.mom &&
      this.mom.distance <= HerbivoreSettings.Calf.PreferredDistanceToAdult
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
    if (this.plant) {
      // If we're touching it, eat it.
      if (this.size.overlaps(this.plant.entity.size)) {
        this.behaviorState.set('Eat')
      }
      // Otherwise, walk toward it.
      else {
        this.movement.moveToward(
          this.plant.entity.position,
          HerbivoreSettings.WalkSpeedPerSec
        )
      }
    }
  }

  enterStateEat() {
    this.movement.stop()
  }

  updateStateEat() {
    // If the plant we're eating is gone, go back to looking.
    if (!this.plant?.entity.eatable) {
      this.behaviorState.set('SeekFood')
      return
    }

    // Once we've finished eating, consume the plant and go back to wandering.
    if (this.behaviorState.age.ms >= HerbivoreSettings.EatDurationMs) {
      this.hunger.eat(this.plant.entity.eatable)
      this.behaviorState.set('Wander')
    }
  }

  updateStateSeekMate() {
    // Find the closest possible mate.
    if (this.mate) {
      // If we're touching it, we're ready to mate with it it.
      if (this.size.overlaps(this.mate.entity.size)) {
        this.behaviorState.set('Mate')
      }
      // Otherwise, walk toward it.
      else {
        this.movement.moveToward(
          this.mate.entity.position,
          HerbivoreSettings.WalkSpeedPerSec
        )
      }
    }
  }

  enterStateMate() {
    this.movement.stop()
  }

  updateStateMate() {
    // Once we've finished mating, go back to eating.
    if (this.behaviorState.age.ms >= HerbivoreSettings.MateDurationMs) {
      this.pregnancy = new AgeTrait()
      this.behaviorState.set('Wander')
    }
  }

  enterStateWander() {
    // If we're full, healthy, and fertile, look for a mate.
    if (
      this.hunger.isSated &&
      this.health.percent > HerbivoreSettings.MateHealthPercent &&
      this.isFertile
    ) {
      this.behaviorState.set('SeekMate')
      return
    }

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
