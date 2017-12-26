import { path, assocPath } from "ramda"

export default function dynamicUIReducers(createStore) {
  return (reducer, ...args) => {
    const store = createStore(reducer, ...args)

    let reducers = []

    function generateReducer() {
      return (state, action) => {
        // const newState = state
        const newState = reducers.reduce(
          (currentState, { path: statePath, reducer }) => {
            const localState = path(statePath, currentState)
            const newLocalState = reducer(localState, action)
            const newState = assocPath(statePath, newLocalState, state)
            return newState
          },
          state
        )

        return reducer(newState, action)
      }
    }

    function addUIReducer({ path, reducer }) {
      reducers.push({ path, reducer })
      store.replaceReducer(generateReducer())
    }

    function removeUIReducer(oldReducer) {
      reducers = reducers.filter(({ reducer }) => reducer !== oldReducer)
      store.replaceReducer(generateReducer())
    }

    return {
      ...store,
      addUIReducer,
      removeUIReducer,
    }
  }
}
