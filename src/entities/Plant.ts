const states = ['Seed', 'Sprout', 'Adolescent', 'Mature', 'Dead'] as const

export class Plant extends GameEntityBase {
  position
  size
  age = AgeTrait.use()
  state = StateTrait.use<typeof states[number]>(this)
  fruit?: Fruit

  constructor(simulator: GameEngine, location: Vector2D) {
    super(simulator)
    this.state.set('Seed')
    this.size = SizeTrait.use({ x: 0, y: 0 })
    this.position = PositionTrait.use(location, this.size)
  }

  update(deltaMs: number) {
    this.age.update(deltaMs)
    this.state.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Green
    this.position.fillRect(ctx)

    if (this.fruit) {
      this.fruit.draw()
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

  enterStateMature() {
    this.fruit = new Fruit(this.position)
  }

  updateStateMature() {
    this.size.width = 9
    this.size.height = 9

    if (this.state.age.seconds >= 2) {
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
