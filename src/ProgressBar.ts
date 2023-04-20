export class ProgressBar {
  wrapperEl: HTMLDivElement
  trackEl: HTMLDivElement
  barEl: HTMLDivElement
  labelEl: HTMLDivElement

  constructor(public parentEl: HTMLElement) {
    this.wrapperEl = document.createElement('div')
    this.wrapperEl.classList.add('progress-bar')
    parentEl.append(this.wrapperEl)

    this.trackEl = document.createElement('div')
    this.trackEl.classList.add('progress-bar__track')
    this.wrapperEl.append(this.trackEl)

    this.barEl = document.createElement('div')
    this.barEl.classList.add('progress-bar__bar')
    this.trackEl.append(this.barEl)

    this.labelEl = document.createElement('div')
    this.labelEl.classList.add('progress-bar__label')
    this.wrapperEl.append(this.labelEl)
  }

  update(percent: number) {
    const value = Math.round(percent * 100) + '%'
    this.barEl.style.width = value
    this.labelEl.innerText = value
  }
}
