// src/ui/LabelMaker/components/standard/register.ts
import type { LabelMakerComponentOf } from '@/types/ui'
import { registerLabelMakerComponents, type LabelMakerUiComponent } from '../../LabelMakerRegistry'

/**
 * LabelMaker 標準セット
 */
const standardComponents = {
  userList: {
    labelKey: 'uiComponents.labelMaker.userList.label',
    descriptionKey: 'uiComponents.labelMaker.userList.description',
    loader: () => import('./UserList.vue'),
  },
  userCardScroller: {
    labelKey: 'uiComponents.labelMaker.userCardScroller.label',
    descriptionKey: 'uiComponents.labelMaker.userCardScroller.description',
    loader: () => import('./UserCardScroller.vue'),
  },
} satisfies Record<LabelMakerComponentOf<'standard'>, LabelMakerUiComponent>

export const registerStandardLabelMakerComponents = () => registerLabelMakerComponents({ standard: standardComponents })
