import * as R from "ramda"

/*
  return the next state once the component at path has been updated
*/
const updateStateAtPath = (uiState, path, values) => {
  const localState = getStateAtPath(uiState, path)
  const { localValues } = splitValues(localState, values)
  // const newLocalState = R.merge(localState, localValues)
  const newLocalState = R.mapObjIndexed((v, k) => {
    const newValue = localValues[k]
    return newValue === undefined
      ? v
      : typeof newValue === "function" ? newValue(v) : newValue
  }, localState)
  return R.assocPath(R.append("state", path), newLocalState, uiState)
}

// Given the path to the state of a particular component, return the path to the state of its parent component
// If the current component is the root, return null
const upOneLevel = path => {
  if (path.length === 1) {
    return []
  }

  return R.init(path)
}

// Return the state of the component at a particular path
export const getStateAtPath = (uiState, path) =>
  R.path(R.append("state", path), uiState)

const splitValues = (localState, values) => {
  const localValues = {}
  const parentValues = {}

  R.forEachObjIndexed((value, key) => {
    if (R.has(key, localState)) {
      localValues[key] = value
    } else {
      parentValues[key] = value
    }
  }, values)

  return { localValues, parentValues }
}

/*
given the previous uiState, currentComponentPath and the values to update, return the new uiState,
should update values that exist in any component level
if property doesnt exist on this level, move on the next level
if the root level is reached and not all properties in the value object have been used, throw an error
  the variable doesnt exist
Every update will only require a single action to update the store, more efficient
*/
export const updateStateTree = (prevUIState, currentPath, valueObj) => {
  let uiState = { ...prevUIState }
  let path = currentPath
  let values = { ...valueObj }

  while (path && path.length > 0) {
    const localState = getStateAtPath(uiState, path)
    const { localValues, parentValues } = splitValues(localState, values)
    uiState = updateStateAtPath(uiState, path, localValues)
    values = parentValues
    path = upOneLevel(path)
  }

  if (!values || !R.isEmpty(values)) {
    throw new Error(
      `Trying to update state variables which do not exist ${R.keys(values)}`
    )
  }

  return uiState
}

export const getAccessibleState = (uiState, path) => {
  let accessibleState = {}

  path.forEach((_, i, wholePath) => {
    const localState = getStateAtPath(uiState, R.take(i + 1, wholePath))
    accessibleState = R.merge(accessibleState, localState)
  })

  return accessibleState
}

export const addStateAtPath = (uiState, path, value) => {
  return R.assocPath(R.append("state", path), value, uiState)
}

export const removeStateAtPath = (uiState, path) => {
  return R.dissocPath(path, uiState)
}

export const __TEST__ = {
  updateStateTree,
  splitValues,
  updateStateAtPath,
  getStateAtPath,
  upOneLevel,
  getAccessibleState,
  addStateAtPath,
  removeStateAtPath,
}
