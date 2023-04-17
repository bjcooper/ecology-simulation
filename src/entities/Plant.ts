import { FoodTrait } from '../composition/FoodTrait'
import type { GameEngine } from '../engine'
import { Vector2D } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { Fruit } from './Fruit'

export const PlantStates = ['Seed', 'Sprout', 'Adolescent', 'Mature'] as const

export type PlantState = (typeof PlantStates)[number]

export class Plant extends GameEntity {
  layer = RenderLayers.Plants
  position
  size
  proximitySensor
  fruit?: Fruit
  state = new StateTrait<PlantState>(this, PlantSettings.AgeRandomizationMs)
  asFood = new FoodTrait(0, this.eaten.bind(this))

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.state.set('Seed')
    this.position = new PositionTrait(x, y)
    this.size = new SizeTrait(0, 0, this.position)
    this.proximitySensor = new SizeTrait(
      PlantSettings.MinProximity,
      PlantSettings.MinProximity,
      this.position
    )
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

  updateStateSeed() {
    this.size.width = 1
    this.size.height = 1
    this.asFood.valueMs = PlantSettings.Seed.FoodValueMs

    if (this.state.age.ms >= PlantSettings.Seed.AgeDurationMs) {
      this.state.set('Sprout')
    }
  }

  updateStateSprout() {
    this.size.width = 3
    this.size.height = 3
    this.asFood.valueMs = PlantSettings.Sprout.FoodValueMs

    if (this.state.age.ms >= PlantSettings.Sprout.AgeDurationMs) {
      this.state.set('Adolescent')
    }
  }

  updateStateAdolescent() {
    this.size.width = 5
    this.size.height = 5
    this.asFood.valueMs = PlantSettings.Adolescent.FoodValueMs

    if (this.state.age.ms >= PlantSettings.Adolescent.AgeDurationMs) {
      this.state.set('Mature')
    }
  }

  updateStateMature() {
    this.size.width = 9
    this.size.height = 9
    this.asFood.valueMs = PlantSettings.Mature.FoodValueMs

    if (!this.fruit) {
      this.fruit = new Fruit(this.position)
    }

    if (this.state.age.ms >= PlantSettings.Mature.AgeDurationMs) {
      this.die()
    }
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
      this.game.registerEntity(newPlant)
    }

    this.remove()
  }

  eaten() {
    this.remove()
  }
}
