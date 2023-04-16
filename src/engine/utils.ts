/**
 * Get seconds in other units.
 */
export function seconds(timeSec: number) {
  return {
    sec: timeSec,
    ms: timeSec * 1000
  }
}

/**
 * Get milliseconds in other units.
 */
export function milliseconds(timeMs: number) {
  return {
    sec: timeMs / 1000,
    ms: timeMs
  }
}

/**
 * Convert seconds into times per second.
 */
export function perSecond(times: number) {
  const perSec = times === 0 ? 0 : 1 / times
  return {
    sec: perSec,
    ms: perSec / 1000
  }
}

/**
 * Pick randomly from a list of options.
 */
export function pick<T>(...args: T[]): T {
  const index = Math.round(Math.random() * (args.length - 1))
  return args[index]
}

/**
 * Roll a dice with the given odds (0 to 1) of hitting.
 */
export function rollChance(odds: number) {
  return Math.random() <= odds
}
