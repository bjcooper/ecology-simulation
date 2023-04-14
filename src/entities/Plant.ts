import type { GameEngine } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { Fruit } from './Fruit'

const states = ['Seed', 'Sprout', 'Adolescent', 'Mature', 'Dead'] as const

export class Plant extends GameEntity {
  position
  size
  proximitySensor
  state = new StateTrait<(typeof states)[number]>(this)
  fruit?: Fruit

  constructor(game: GameEngine, x: number, y: number) {
    super(game)
    this.state.set('Seed')
    this.state.age._ms = Math.random() * PlantSettings.AgeRandomizationMs
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
    this.size.width = 0
    this.size.height = 0

    if (this.state.age.ms >= PlantSettings.SeedDurationMs) {
      this.state.set('Sprout')
    }
  }

  updateStateSprout() {
    this.size.width = 3
    this.size.height = 3

    if (this.state.age.ms >= PlantSettings.SproutDurationMs) {
      this.state.set('Adolescent')
    }
  }

  updateStateAdolescent() {
    this.size.width = 5
    this.size.height = 5

    if (this.state.age.ms >= PlantSettings.AsolescentDurationMs) {
      this.state.set('Mature')
    }
  }

  updateStateMature() {
    this.size.width = 9
    this.size.height = 9

    if (!this.fruit) {
      this.fruit = new Fruit(this.position)
    }

    if (this.state.age.ms >= PlantSettings.MatureDurationMs) {
      this.state.set('Dead')
    }
  }

  updateStateDead() {
    // Generate some potential seed locations.
    const newLocations = []
    while (newLocations.length < 4) {
      newLocations.push({ x: this.position.x, y: this.position.y })
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
      .filter(position => this.game.screenSize.contains(position))
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
}
