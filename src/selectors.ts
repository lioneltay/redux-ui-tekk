import * as R from "ramda"

import { getAccessibleState } from "./helpers/index"

// Allow the composition of uiSelector and normal reduxSelectors
export const createUISelector = uiSelector => (state, props) => {
  if (!state.__uiState) {
    throw new Error(
      "A uiSelector cannot be used in a component which is not connect to uiState"
    )
  }
  return uiSelector(state.__uiState, props)
}
