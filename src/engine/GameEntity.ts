import type { IGameEntity } from '.'
import type { GameEngine } from './GameEngine'

export abstract class GameEntity implements IGameEntity {
  layer = 0

  constructor(public game: GameEngine) {}

  remove() {
    this.game.unregisterEntity(this)
  }
}
