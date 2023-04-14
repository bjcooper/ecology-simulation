import type { GameEngine, Vector2D } from '../engine'
import { GameEntity, PositionTrait, SizeTrait, StateTrait } from '../engine'
import { Fruit } from './Fruit'

const states = ['Seed', 'Sprout', 'Adolescent', 'Mature', 'Dead'] as const
const minProximity = new SizeTrait(30, 30)

export class Plant extends GameEntity {
  position
  size
  proximitySensor
  state = new StateTrait<(typeof states)[number]>(this)
  fruit?: Fruit

  constructor(game: GameEngine, location: Vector2D) {
    super(game)
    this.state.set('Seed')
    this.size = new SizeTrait(0, 0)
    this.position = new PositionTrait(location, this.size)
    this.proximitySensor = new PositionTrait(location, minProximity)
  }

  update(deltaMs: number) {
    this.state.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.GreenDark
    this.position.fillRect(ctx)

    if (this.fruit) {
      this.fruit.draw(ctx)
    }
  }

  updateStateSeed() {
    this.size.width = 0
    this.size.height = 0

    if (this.state.age.seconds >= 2) {
      this.state.set('Sprout')
    }
  }

  updateStateSprout() {
    this.size.width = 3
    this.size.height = 3

    if (this.state.age.seconds >= 2) {
      this.state.set('Adolescent')
    }
  }

  updateStateAdolescent() {
    this.size.width = 5
    this.size.height = 5

    if (this.state.age.seconds >= 2) {
      this.state.set('Mature')
    }
  }

  updateStateMature() {
    this.size.width = 9
    this.size.height = 9

    if (!this.fruit) {
      this.fruit = new Fruit(this.position)
    }

    if (this.state.age.seconds >= 2) {
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
      minProximity.height + Math.random() * minProximity.height
    newLocations[1].y +=
      minProximity.height + Math.random() * minProximity.height
    newLocations[2].x -= minProximity.width + Math.random() * minProximity.width
    newLocations[3].x += minProximity.width + Math.random() * minProximity.width

    // Remove the ones out of bounds and create new plants.
    let newPlants = newLocations
      .filter(position => this.game.screen.contains(position))
      .map(location => {
        return new Plant(this.game, location)
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
