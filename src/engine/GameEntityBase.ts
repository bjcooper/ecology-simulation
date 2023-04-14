import type { GameEntity } from '.'
import type { GameEngine } from './GameEngine'

export abstract class GameEntityBase implements GameEntity {
  game: GameEngine

  constructor(game: GameEngine) {
    this.game = game
  }

  add() {
    this.game.registerEntity(this)
  }

  remove() {
    this.game.unregisterEntity(this)
  }
}
