import '../styles/styles.scss'
import { GameEngine } from './engine'
import { Ground } from './entities/Ground'
import { Stats } from './entities/Stats'

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game-canvas')
if (canvas) {
  // Initialize our game engine.
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const game = new GameEngine(canvas)

  // Initialize entities.
  game.registerEntity(new Ground(game))
  game.registerEntity(new Stats(game))
  // for (let i = 0; i < 15; i++) {
  //   const plant = new Plant(game, {
  //     x: game.worldSize.x * Math.random(),
  //     y: game.worldSize.y * Math.random()
  //   })
  //   plant.state.set('Mature')
  //   game.registerEntity(plant)
  // }
  // game.registerEntity(new Stats(game))

  // Play!
  game.play()
}
