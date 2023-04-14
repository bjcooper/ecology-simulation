import '../styles/styles.scss'
import { GameEngine } from './engine'
import { Ground } from './entities/Ground'
import { Plant } from './entities/Plant'
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
  for (let i = 0; i < 15; i++) {
    const plant = new Plant(game, {
      x: game.screenSize.width * Math.random(),
      y: game.screenSize.height * Math.random()
    })
    plant.state.set('Mature')
    game.registerEntity(plant)
  }

  // Play!
  game.play()
}
