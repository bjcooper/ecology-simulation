import type { DrawCallback } from '..'
import { AgeTrait } from './AgeTrait'

export class StateTrait<S extends string> {
  age = new AgeTrait()
  deltsMs = 0
  stateDurationMs: null | number = null
  previousState: null | S = null
  currentState: null | S = null
  nextState: null | S = null

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

  get progressPercent() {
    return this.stateDurationMs === null || this.stateDurationMs === 0
      ? 0
      : this.age.ms / this.stateDurationMs
  }

  update(deltaMs: number) {
    this.deltsMs = deltaMs
    this.age.update(deltaMs)

    if (
      this.stateDurationMs !== null &&
      this.nextState &&
      this.age.ms >= this.stateDurationMs
    ) {
      this.set(this.nextState)
    }

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

  set(newState: null | S) {
    // Update our state variables.
    this.previousState = this.currentState
    this.nextState = null
    this.currentState = newState
    this.stateDurationMs = null
    this.age._ms = Math.random() * this.ageRandomization

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

  next(nextState: S, stateDurationMs: number) {
    this.nextState = nextState
    this.stateDurationMs = stateDurationMs
  }
}
