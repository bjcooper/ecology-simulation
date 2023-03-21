import './styles/styles.scss'
import { GameEngine } from '../other/super-simple-game-engine/src/GameEngine'
import { Ground } from './src/entities/Ground'

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game-canvas')
if (canvas) {
  // Initialize our game engine.
  const game = new GameEngine(canvas)

  // Resize when the window resizes.
  window.addEventListener('resize', () => {
    game.resizeCanvas()
  })

  // Initialize entities.
  game.registerEntity(new Ground(game))

  // Play!
  game.play()
}

