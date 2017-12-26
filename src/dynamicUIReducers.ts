import { getStateAtPath, updateStateAtPath } from "./helpers"
import { assoc } from "ramda"

export default function dynamicUIReducers(createStore) {
  return (originalReducer, ...args) => {
    const store = createStore(originalReducer, ...args)

    let reducers = []

    function generateReducer() {
      return (state, action) => {
        const newState = reducers.reduce((currentState, { path, reducer }) => {
          if (!currentState) {
            return currentState
          }

          const localState = getStateAtPath(currentState.ui, path)
          const newLocalState = reducer(localState, action)
          return newLocalState
            ? assoc(
                "ui",
                updateStateAtPath(currentState.ui, path, newLocalState),
                currentState
              )
            : currentState
        }, state)

        // const newState = state
        return originalReducer(newState, action)
      }
    }

    function addUIReducer({ path, reducer }) {
      console.log("adding reducer", path)
      reducers.push({ path, reducer })
      store.replaceReducer(generateReducer())
    }

    function removeUIReducer(oldReducer) {
      console.log("removing reducer", path)
      reducers = reducers.filter(({ reducer }) => reducer !== oldReducer)
      store.replaceReducer(generateReducer())
    }

    return {
      ...store,
      addUIReducer,
      removeUIReducer,
      uiReducers: reducers,
    }
  }
}
