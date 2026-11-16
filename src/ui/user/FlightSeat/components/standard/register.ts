// src/ui/user/FlightSeat/components/standard/register.ts
import type { FlightSeatComponentOf } from '@/types/ui'
import {
  registerFlightSeatComponents,
  type FlightSeatPreset,
  type FlightSeatUiComponent,
} from '../../FlightSeatRegistry'

const preset = (key: string, layout: number[]): FlightSeatPreset => ({
  labelKey: `uiSettings.flightSeat.presets.${key}`,
  layout,
})

// plain / nineViewers 共通(3×3 を基本に、横一列・縦一列)
const gridPresets = [preset('grid3x3', [3, 3, 3]), preset('row', [9]), preset('column', [1, 1, 1, 1, 1, 1, 1, 1, 1])]

/**
 * FlightSeat 標準セット
 * defaultLayout が座席数の唯一の定義元(customLayout があれば上書き)
 */
const standardComponents = {
  plain: {
    labelKey: 'uiComponents.flightSeat.plain.label',
    defaultLayout: '[3, 3, 3]',
    presets: gridPresets,
    framed: false,
    loader: () => import('./SeatNineViewers.vue'),
  },
  nineViewers: {
    labelKey: 'uiComponents.flightSeat.nineViewers.label',
    defaultLayout: '[3, 3, 3]',
    presets: gridPresets,
    framed: true,
    loader: () => import('./SeatNineViewers.vue'),
  },
  bingo: {
    labelKey: 'uiComponents.flightSeat.bingo.label',
    defaultLayout: 24,
    presets: null,
    framed: true,
    loader: () => import('./SeatBingo.vue'),
  },
  flightSeat: {
    labelKey: 'uiComponents.flightSeat.flightSeat.label',
    defaultLayout: '[4, 6, 6, 6]',
    presets: [
      preset('standardCabin', [4, 6, 6, 6]),
      preset('regionalJet', [3, 3, 4]),
      preset('wideBody', [3, 4, 4, 4, 3]),
      preset('fullLongHaul', [6, 8, 8, 8, 8, 6, 4]),
      preset('jumboCabin', [4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4]),
    ],
    framed: true,
    loader: () => import('./SeatFlightSeat.vue'),
  },
  graduation: {
    labelKey: 'uiComponents.flightSeat.graduation.label',
    defaultLayout: '[12, 13, 12]',
    presets: [
      preset('normalClass', [12, 13, 12]),
      preset('smallClass', [8, 7, 8]),
      preset('twoClasses', [16, 17, 16, 17]),
      preset('wholeGrade', [20, 21, 20, 21, 18]),
    ],
    framed: true,
    loader: () => import('./SeatGraduation.vue'),
  },
  ferrisWheel: {
    labelKey: 'uiComponents.flightSeat.ferrisWheel.label',
    defaultLayout: 13,
    presets: null,
    framed: false,
    loader: () => import('./SeatFerrisWheel.vue'),
  },
  goldenCrowd: {
    labelKey: 'uiComponents.flightSeat.goldenCrowd.label',
    defaultLayout: '[22, 23, 24, 23, 24, 23, 22, 23, 24, 23, 24, 23, 22]',
    presets: [
      preset('friends100', [12, 13, 12, 13, 12, 13, 12, 13]),
      preset('fill300', [22, 23, 24, 23, 24, 23, 22, 23, 24, 23, 24, 23, 22]),
    ],
    framed: true,
    loader: () => import('./SeatGoldenCrowd.vue'),
  },
} satisfies Record<FlightSeatComponentOf<'standard'>, FlightSeatUiComponent>

export const registerStandardFlightSeatComponents = () => registerFlightSeatComponents({ standard: standardComponents })
