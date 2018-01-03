import * as R from "ramda"
import { removeStateAtPath } from "../helpers/index"
import { removeMetaData } from "../helpers/meta"
import { ComponentPath } from "../types"

export default (uiState, componentPath) => {
  const key = R.last(componentPath)

  const updatedState = removeStateAtPath(uiState, componentPath)

  return removeMetaData(updatedState, key)
}
