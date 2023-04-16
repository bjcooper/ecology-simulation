import '../styles/styles.scss'
import { GameEngine } from './engine'
import { pick } from './engine/utils'
import { Ground } from './entities/Ground'
import { AnimalStates, Herbivore } from './entities/Herbivore'
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

  for (let i = 0; i < PlantSettings.StartingCount; i++) {
    const plant = new Plant(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    plant.state.set('Mature')
    game.registerEntity(plant)
  }

  for (let i = 0; i < HerbivoreSettings.StartingCount; i++) {
    const herbivore = new Herbivore(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    herbivore.state.set(pick(...AnimalStates))
    game.registerEntity(herbivore)
  }

  // Play!
  game.play()
}
