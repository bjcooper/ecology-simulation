import type { DrawCallback } from '..'
import { AgeTrait } from './AgeTrait'

export class StateTrait<S extends string> {
  parent: object
  age = AgeTrait.use()
  deltsMs = 0
  previousState: null | S = null
  currentState: null | S = null

  constructor(parent: object) {
    this.parent = parent
  }

  static use<S extends string>(parent: object) {
    return new StateTrait<S>(parent)
  }

  protected getStateCallback(baseName: string, state: null | S) {
    if (state) {
      const cb = `${baseName}${state}`
      if (
        cb in parent &&
        typeof parent[cb as keyof typeof parent] === 'function'
      ) {
        return parent[cb as keyof typeof parent] as () => void
      }
    }
    return null
  }

  update(deltaMs: number) {
    this.deltsMs = deltaMs
    this.age.update(deltaMs)
    const cb = this.getStateCallback('updateState', this.currentState)
    if (cb) {
      cb.call(parent)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const cb = this.getStateCallback('drawState', this.currentState)
    if (cb) {
      ;(cb as DrawCallback).call(parent, ctx)
    }
  }

  set(newState: null | S) {
    // If we're already in the given state, don't do anything.
    if (newState === this.currentState) {
      return
    }

    // Update our state variables.
    this.previousState = this.currentState
    this.currentState = newState
    this.age._ms = 0

    // Invoke leave/enter hooks.
    const leaveCb = this.getStateCallback('leaveState', this.previousState)
    if (leaveCb) {
      leaveCb.call(parent)
    }

    const enterCb = this.getStateCallback('enterState', this.currentState)
    if (enterCb) {
      enterCb.call(parent)
    }
  }
}
