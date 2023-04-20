import '../styles/styles.scss'
import { GameEngine } from './engine'
import { pick } from './engine/utils'
import { Ground } from './entities/Ground'
import { Herbivore } from './entities/Herbivore'
import { HerbivoreReporter } from './entities/HerbivoreReporter'
import { Plant } from './entities/Plant'
import { PlantReporter } from './entities/PlantReporter'
import { Stats } from './entities/Stats'

const canvas = document.querySelector<HTMLCanvasElement>('canvas#game-canvas')
if (canvas) {
  // Initialize our game engine.
  canvas.width = 600
  canvas.height = 600
  const game = new GameEngine(canvas)

  // Initialize entities.
  new Ground(game).add()

  // Spawn plants.
  for (let i = 0; i < PlantSettings.StartingCount; i++) {
    const plant = new Plant(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    plant.state.set(pick('Seed', 'Sprout', 'Adolescent', 'Mature'))
    plant.add()
  }

  // Spawn herbivores.
  for (let i = 0; i < HerbivoreSettings.StartingCount; i++) {
    const herbivore = new Herbivore(
      game,
      game.screenSize.width * Math.random(),
      game.screenSize.height * Math.random()
    )
    herbivore.ageState.set(pick('Calf', 'Adolescent', 'Adult', 'Old'))
    herbivore.add()
  }

  // Add stats and reporters.
  new Stats(game).add()
  new PlantReporter(game).add()
  new HerbivoreReporter(game).add()

  // Play!
  game.play()
}
