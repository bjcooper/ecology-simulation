import type { DrawCallback } from '..'
import { AgeTrait } from './AgeTrait'

export class StateTrait<S extends string> {
  age = new AgeTrait()
  deltsMs = 0
  previousState: null | S = null
  currentState: null | S = null

  constructor(public owner: object, public ageRandomization = 0) {}

  protected getStateCallback(baseName: string, state: null | S) {
    if (state) {
      const cb = `${baseName}${state}`
      if (
        cb in this.owner &&
        typeof this.owner[cb as keyof typeof this.owner] === 'function'
      ) {
        return this.owner[cb as keyof typeof this.owner] as () => void
      }
    }
    return null
  }

  update(deltaMs: number) {
    this.deltsMs = deltaMs
    this.age.update(deltaMs)
    const cb = this.getStateCallback('updateState', this.currentState)
    if (cb) {
      cb.call(this.owner)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cb = this.getStateCallback('drawState', this.currentState)
    if (cb) {
      ;(cb as DrawCallback).call(this.owner, ctx)
    }
  }

  set(newState: null | S, ageRandomization?: number) {
    // Update our state variables.
    this.previousState = this.currentState
    this.currentState = newState
    this.age._ms =
      Math.random() *
      (ageRandomization === undefined
        ? this.ageRandomization
        : ageRandomization)

    // Invoke leave/enter hooks.
    const leaveCb = this.getStateCallback('leaveState', this.previousState)
    if (leaveCb) {
      leaveCb.call(this.owner)
    }

    const enterCb = this.getStateCallback('enterState', this.currentState)
    if (enterCb) {
      enterCb.call(this.owner)
    }
  }
}
