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

export const PlantSettings = {
  StartingCount: 20,
  MinProximity: 30,
  AgeRandomizationMs: 2000,
  SeedDurationMs: 5000,
  SproutDurationMs: 5000,
  AsolescentDurationMs: 10000,
  MatureDurationMs: 5000
}

export const HerbivoreSettings = {
  StartingCount: 10,
  AgeRandomizationMs: 1000,
  CalfDurationMs: 3000,
  AdolescentDurationMs: 3000,
  AdultDurationMs: 10000,
  OldDurationMs: 3000
}
