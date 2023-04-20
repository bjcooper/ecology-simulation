import { FoodTrait } from '../composition/FoodTrait'
import type { GameEngine } from '../engine'
import { Vector2D } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { Fruit } from './Fruit'

export const PlantStates = [
  'Seed',
  'Sprout',
  'Adolescent',
  'Mature',
  'Dead'
] as const

export type PlantState = (typeof PlantStates)[number]

export class Plant extends GameEntity {
  layer = RenderLayers.Plants
  position
  size
  proximitySensor
  fruit?: Fruit
  eatable?: FoodTrait
  state = new StateTrait<PlantState>(this, PlantSettings.AgeRandomizationMs)

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(0, 0, this.position)
    this.proximitySensor = new SizeTrait(
      PlantSettings.MinProximity,
      PlantSettings.MinProximity,
      this.position
    )
    this.state.set('Seed')
  }

  add() {
    super.add()
  }

  update(deltaMs: number) {
    this.state.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Green
    this.size.fillRect(ctx)

    if (this.fruit) {
      this.fruit.draw(ctx)
    }
  }

  enterStateSeed() {
    this.state.next('Sprout', PlantSettings.Seed.AgeDurationMs)
    this.size.width = 1
    this.size.height = 1
  }

  enterStateSprout() {
    this.state.next('Adolescent', PlantSettings.Sprout.AgeDurationMs)
    this.size.width = 3
    this.size.height = 3
  }

  enterStateAdolescent() {
    this.state.next('Mature', PlantSettings.Adolescent.AgeDurationMs)
    this.size.width = 5
    this.size.height = 5

    if (!this.eatable) {
      this.eatable = new FoodTrait(0, this.eaten.bind(this))
    }
    this.eatable.valueMs = PlantSettings.Adolescent.FoodValueMs
  }

  enterStateMature() {
    this.state.next('Dead', PlantSettings.Mature.AgeDurationMs)
    this.size.width = 9
    this.size.height = 9

    if (!this.eatable) {
      this.eatable = new FoodTrait(0, this.eaten.bind(this))
    }
    this.eatable.valueMs = PlantSettings.Mature.FoodValueMs

    if (!this.fruit) {
      this.fruit = new Fruit(this.position)
    }
  }

  enterStateDead() {
    this.die()
  }

  die() {
    // Generate some potential seed locations.
    const newLocations = []
    while (newLocations.length < 4) {
      newLocations.push(
        new Vector2D(this.position.screenX, this.position.screenY)
      )
    }
    newLocations[0].y -=
      PlantSettings.MinProximity + Math.random() * PlantSettings.MinProximity
    newLocations[1].y +=
      PlantSettings.MinProximity + Math.random() * PlantSettings.MinProximity
    newLocations[2].x -=
      PlantSettings.MinProximity + Math.random() * PlantSettings.MinProximity
    newLocations[3].x +=
      PlantSettings.MinProximity + Math.random() * PlantSettings.MinProximity

    // Remove the ones out of bounds and create new plants.
    let newPlants = newLocations
      .filter(location => this.game.screenSize.contains(location))
      .map(location => {
        return new Plant(this.game, location.x, location.y)
      })

    // Get current plants so we don't plant more where one already exists.
    const plants = this.game.entities.filter(x => x instanceof Plant) as Plant[]
    for (const plant of plants) {
      newPlants = newPlants.filter(
        newPlant => !plant.proximitySensor.overlaps(newPlant.proximitySensor)
      )
      if (!newLocations.length) {
        break
      }
    }

    for (const newPlant of newPlants) {
      newPlant.add()
    }

    this.remove()
  }

  eaten() {
    this.remove()
  }
}
