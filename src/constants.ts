import { seconds, perSecond } from './engine/utils'

export const Color = {
  Red: '#D95A4E',
  RedDark: '#7A3B45',
  RedExtraDark: '#542F2F',
  OrangeExtraDark: '#542F2F',
  Orange: '#CF9153',
  OrangeDark: '#785946',
  OrangeLight: '#E8C87D',
  OrangeExtraLight: '#F3E4A0',
  YellowLight: '#D0DC7D',
  Yellow: '#D0DC7D',
  YellowDark: '#597A56',
  YellowExtraDark: '#394A45',
  GreenExtraDark: '#394A45',
  GreenDark: '#3D6952',
  Green: '#7BBA5B',
  Blue: '#5891B0',
  BlueDark: '#385370',
  BlueExtraDark: '#32344A',
  PurpleExtraDark: '#32344A',
  PurpleDark: '#6B3A65',
  Purple: '#B35472',
  GrayExtraLight: '#EAE4CF',
  GrayLight: '#B3AD9B',
  Gray: '#52504D',
  GrayDark: '#3B3837',
  GrayExtraDark: '#292826'
}

export const Font = {
  UI: 'Mulish'
}

export const RenderLayers = {
  Default: 0,
  Ground: -10,
  Plants: 10,
  Herbivores: 20,
  UI: 1000
}

export const GeneralSettings = {
  Hunger: {
    HungerThresholdPercent: 0.5,
    StarvationDamagePerMs: perSecond(1).ms,
    SatedHealingPerMs: perSecond(1).ms
  }
}

export const PlantSettings = {
  StartingCount: 40,
  MinProximity: 30,
  AgeRandomizationMs: seconds(2).ms,
  Seed: {
    AgeDurationMs: seconds(5).ms
  },
  Sprout: {
    AgeDurationMs: seconds(5).ms
  },
  Adolescent: {
    AgeDurationMs: seconds(10).ms,
    FoodValueMs: seconds(5).ms
  },
  Mature: {
    AgeDurationMs: seconds(5).ms,
    FoodValueMs: seconds(10).ms
  }
}

export const HerbivoreSettings = {
  // General
  StartingCount: 10,
  AgeBasedSizeGrowth: 4,
  AgeRandomizationMs: seconds(1).ms,
  WalkSpeedPerSec: 20,
  WanderSpeedPerSec: 10,
  Calf: {
    Health: 10,
    RunSpeedPerSec: 20,
    PreferredDistanceToAdult: 18,
    AgeDurationMs: seconds(15).ms,
    MaxHungerMs: seconds(5).ms,
    NursingDurationMs: seconds(1).ms
  },
  Adolescent: {
    Health: 15,
    RunSpeedPerSec: 30,
    AgeDurationMs: seconds(15).ms,
    MaxHungerMs: seconds(10).ms
  },
  Adult: {
    Health: 20,
    RunSpeedPerSec: 30,
    AgeDurationMs: seconds(15).ms,
    MaxHungerMs: seconds(10).ms
  },
  Old: {
    Health: 10,
    RunSpeedPerSec: 20,
    AgeDurationMs: seconds(15).ms,
    MaxHungerMs: seconds(10).ms
  }
}
