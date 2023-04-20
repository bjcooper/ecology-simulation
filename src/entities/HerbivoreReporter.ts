import { ProgressBar } from '../ProgressBar'
import { GameEntity } from '../engine'
import { Herbivore } from './Herbivore'

type Elements = {
  row: HTMLTableRowElement
  age: HTMLTableCellElement
  ageProgress: ProgressBar
  healthProgress: ProgressBar
  hungerProgress: ProgressBar
  behavior: HTMLTableCellElement
  pregnancyProgress: ProgressBar
  digestionProgress: ProgressBar
}

export class HerbivoreReporter extends GameEntity {
  countEl = document.getElementById('herbivore-count')
  herbivoreEls: Record<number, Elements> = {}

  update(_deltaMs: number) {
    // Keep an up-to-date list of herbivores in the game.
    const toRemove = Object.assign({}, this.herbivoreEls)
    for (const herbivore of this.game.entities) {
      if (!(herbivore instanceof Herbivore)) {
        continue
      }

      // Add new herbivores.
      if (!this.herbivoreEls[herbivore.id]) {
        this.herbivoreEls[herbivore.id] = this.buildElements()
      }
      delete toRemove[herbivore.id]
    }

    // Remove everything left over.
    for (const id in toRemove) {
      toRemove[id].row.remove()
      delete this.herbivoreEls[id]
    }
  }

  draw() {
    // Update herbivore count.
    if (this.countEl) {
      this.countEl.innerText = Object.keys(this.herbivoreEls).length.toString()
    }

    // Update individual herbivore info.
    for (const id in this.herbivoreEls) {
      const herbivore = this.game.entity(parseInt(id))
      if (!herbivore || !(herbivore instanceof Herbivore)) {
        continue
      }

      this.herbivoreEls[id].age.innerText =
        herbivore.ageState.currentState || 'none'

      this.herbivoreEls[id].ageProgress.update(
        herbivore.ageState.progressPercent
      )

      this.herbivoreEls[id].healthProgress.update(herbivore.health.percent)

      this.herbivoreEls[id].hungerProgress.update(herbivore.hunger.percent)

      this.herbivoreEls[id].behavior.innerText =
        herbivore.behaviorState.currentState || 'none'

      if (herbivore.pregnancy) {
        this.herbivoreEls[id].pregnancyProgress.update(
          herbivore.pregnancy.ms / HerbivoreSettings.PregnancyDurationMs
        )
      } else {
        this.herbivoreEls[id].pregnancyProgress.update(0)
      }

      if (herbivore.digestion) {
        this.herbivoreEls[id].digestionProgress.update(
          herbivore.digestion.ms / HerbivoreSettings.DigestionDurationMs
        )
      } else {
        this.herbivoreEls[id].digestionProgress.update(0)
      }
    }
  }

  protected buildElements(): Elements {
    // Add a table row.
    const row = document.createElement('tr')
    document.getElementById('herbivores')?.append(row)

    // Add an age cell.
    const age = document.createElement('td')
    row.append(age)

    // Add an age progress cell and progress bar.
    const ageProgressCell = document.createElement('td')
    row.append(ageProgressCell)
    const ageProgress = new ProgressBar(ageProgressCell)

    // Add a health progress cell and progress bar.
    const healthProgressCell = document.createElement('td')
    row.append(healthProgressCell)
    const healthProgress = new ProgressBar(healthProgressCell)

    // Add a hunger progress cell and progress bar.
    const hungerProgressCell = document.createElement('td')
    row.append(hungerProgressCell)
    const hungerProgress = new ProgressBar(hungerProgressCell)

    // Add a behavior cell.
    const behavior = document.createElement('td')
    row.append(behavior)

    // Add a pregnancy progress cell and progress bar.
    const pregnancyProgressCell = document.createElement('td')
    row.append(pregnancyProgressCell)
    const pregnancyProgress = new ProgressBar(pregnancyProgressCell)

    // Add a pregnancy progress cell and progress bar.
    const digestionProgressCell = document.createElement('td')
    row.append(digestionProgressCell)
    const digestionProgress = new ProgressBar(digestionProgressCell)

    return {
      row,
      age,
      ageProgress,
      healthProgress,
      hungerProgress,
      behavior,
      pregnancyProgress,
      digestionProgress
    }
  }
}
