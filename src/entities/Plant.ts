import { hasAge } from "../../../other/super-simple-game-engine/src/composition/hasAge"
import { hasPosition } from "../../../other/super-simple-game-engine/src/composition/hasPosition"
import { hasSize } from "../../../other/super-simple-game-engine/src/composition/hasSize"
import { hasStates } from "../../../other/super-simple-game-engine/src/composition/hasStates"
import { GameEngine } from "../../../other/super-simple-game-engine/src/GameEngine"
import { GameEntityBase } from "../../../other/super-simple-game-engine/src/GameEntityBase"
import { Color } from "../constants"
import { Fruit } from "./Fruit"

const states = ['Seed', 'Sprout', 'Adolescent', 'Mature', 'Dead'] as const

export class Plant extends GameEntityBase implements GameEntity {
  position
  size
  age = hasAge()
  fruit?: Fruit
  state = hasStates<typeof states[number]>(this)

  constructor(simulator: GameEngine, location: Vector2D) {
    super(simulator)
    this.state.set('Seed')
    this.size = hasSize({ x: 0, y: 0 })
    this.position = hasPosition(location, this.size)
  }

  update(deltaMs: number) {
    this.age.update(deltaMs)
    this.state.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Green
    this.position.fillRect(ctx)

    if (this.fruit) {
      this.fruit.draw(ctx)
    }
  }

  updateStateSeed() {
    this.size.x = 0
    this.size.y = 0

    if (this.state.age.seconds() >= 2) {
      this.state.set('Sprout')
    }
  }

  updateStateSprout() {
    this.size.x = 3
    this.size.y = 3

    if (this.state.age.seconds() >= 2) {
      this.state.set('Adolescent')
    }
  }

  updateStateAdolescent() {
    this.size.x = 5
    this.size.y = 5

    if (this.state.age.seconds() >= 2) {
      this.state.set('Mature')
    }
  }

  enterStateMature() {
    this.fruit = new Fruit(this.position)
  }

  updateStateMature() {
    this.size.x = 9
    this.size.y = 9

    if (this.state.age.seconds() >= 2) {
      this.state.set('Dead')
    }
  }

  updateStateDead() {
    // Get the seed locations we want to plant. Make sure they're in bounds.
    const offset = 20
    let newLocations = [
      {
        x: this.position.x,
        y: this.position.y - offset
      },
      {
        x: this.position.x,
        y: this.position.y + offset
      },
      {
        x: this.position.x - offset,
        y: this.position.y
      },
      {
        x: this.position.x + offset,
        y: this.position.y
      }
    ].filter(
      position => this.game.world.contains(position)
    )

    // Get current plants so we don't plant more where one already exists.
    const plants = this.game.entities.filter(x => x instanceof Plant) as Plant[]
    for (const plant of plants) {
      newLocations = newLocations.filter(
        position => !plant.position.contains(position)
      )
      if (!newLocations.length) {
        break
      }
    }

    for (const location of newLocations) {
      const seed = new Plant(this.game, location)
      this.game.registerEntity(seed)
    }

    this.remove()
  }
}
