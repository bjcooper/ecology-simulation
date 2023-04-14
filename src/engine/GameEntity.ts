import type { IGameEntity } from '.'
import type { GameEngine } from './GameEngine'

export abstract class GameEntity implements IGameEntity {
  game: GameEngine

  constructor(game: GameEngine) {
    this.game = game
  }

  remove() {
    this.game.unregisterEntity(this)
  }
}
