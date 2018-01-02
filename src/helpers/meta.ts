import * as R from "ramda"
import { ComponentPath, UIState } from "../types"

interface MetaData {
  key: string
  componentPath: ComponentPath
}

export const addMetaData = (uiState: UIState, metaData: MetaData) => {
  return R.assocPath(["__meta", metaData.key], metaData, uiState)
}
