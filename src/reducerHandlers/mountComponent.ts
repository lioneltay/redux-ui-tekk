import * as R from "ramda"
import { addStateAtPath } from "../helpers/index"
import { addMetaData } from "../helpers/meta"
import { ComponentPath } from "../types"

export default (uiState, componentPath: ComponentPath, componentState) => {
  const key = R.last(componentPath)

  const updatedState = addStateAtPath(uiState, componentPath, componentState)

  return addMetaData(updatedState, {
    key,
    componentPath,
  })
}
