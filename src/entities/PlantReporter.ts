import { ProgressBar } from '../ProgressBar'
import { GameEntity } from '../engine'
import { Plant } from './Plant'

type Elements = {
  row: HTMLTableRowElement
  age: HTMLTableCellElement
  ageProgress: ProgressBar
}

export class PlantReporter extends GameEntity {
  countEl = document.getElementById('plant-count')
  plantEls: Record<number, Elements> = {}

  update(_deltaMs: number) {
    // Keep an up-to-date list of plants in the game.
    const toRemove = Object.assign({}, this.plantEls)
    for (const plant of this.game.entities) {
      if (!(plant instanceof Plant)) {
        continue
      }

      // Add new plants.
      if (!this.plantEls[plant.id]) {
        this.plantEls[plant.id] = this.buildElements()
      }
      delete toRemove[plant.id]
    }

    // Remove everything left over.
    for (const id in toRemove) {
      toRemove[id].row.remove()
      delete this.plantEls[id]
    }
  }

  draw() {
    // Update plant count.
    if (this.countEl) {
      this.countEl.innerText = Object.keys(this.plantEls).length.toString()
    }

    // Update individual plant info.
    for (const id in this.plantEls) {
      const plant = this.game.entity(parseInt(id))
      if (!plant || !(plant instanceof Plant)) {
        continue
      }

      this.plantEls[id].age.innerText = plant.state.currentState || 'none'
      this.plantEls[id].ageProgress.update(plant.state.progressPercent)
    }
  }

  protected buildElements(): Elements {
    // Add a table row.
    const row = document.createElement('tr')
    document.getElementById('plants')?.append(row)

    // Add an age cell.
    const age = document.createElement('td')
    row.append(age)

    // Add an age progress cell and progress bar.
    const progressCell = document.createElement('td')
    row.append(progressCell)
    const ageProgress = new ProgressBar(progressCell)

    return {
      row,
      age,
      ageProgress
    }
  }
}
