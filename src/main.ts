import '../styles/styles.scss'
import { GameEngine } from './engine'
import { pick } from './engine/utils'
import { Ground } from './entities/Ground'
import { Herbivore } from './entities/Herbivore'
import { Plant, PlantStates } from './entities/Plant'
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

  // Spawn plants.
  for (let i = 0; i < PlantSettings.StartingCount; i++) {
    const plant = new Plant(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    plant.state.set(pick(...PlantStates))
    game.registerEntity(plant)
  }

  // Spawn herbivores.
  for (let i = 0; i < HerbivoreSettings.StartingCount; i++) {
    const herbivore = new Herbivore(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    // herbivore.state.set(pick('Calf', 'Adolescent', 'Adult', 'Old'))
    herbivore.ageState.set(pick('Adolescent'))
    game.registerEntity(herbivore)
  }

  // Play!
  game.play()
}
