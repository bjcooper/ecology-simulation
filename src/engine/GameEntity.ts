import type { IGameEntity } from '.'
import type { GameEngine } from './GameEngine'

export abstract class GameEntity implements IGameEntity {
  id: number
  layer = 0

  constructor(public game: GameEngine) {
    this.id = game.newId()
  }

  add() {
    this.game.registerEntity(this)
  }

  remove() {
    this.game.unregisterEntity(this)
  }
}
