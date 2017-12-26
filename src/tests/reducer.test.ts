import { createStore } from "redux"
import reducer from "../reducer"
import { mountComponent, unmountComponent, updateState } from "../actions"

test("mountComponent:", () => {
  const store = createStore(reducer)

  store.dispatch(
    mountComponent({ componentPath: ["root"], state: { root: "root" } })
  )
  store.dispatch(
    mountComponent({ componentPath: ["root2"], state: { root2: "root2" } })
  )
  store.dispatch(
    mountComponent({
      componentPath: ["root", "child"],
      state: { child: "child" },
    })
  )

  expect(store.getState()).toEqual({
    root: {
      state: {
        root: "root",
      },
      child: {
        state: {
          child: "child",
        },
      },
    },
    root2: {
      state: {
        root2: "root2",
      },
    },
  })
})

test("unmountComponent:", () => {
  const initialState = {
    root: {
      state: {
        root: "root",
      },
      child: {
        state: {
          child: "child",
        },
      },
    },
    root2: {
      state: {
        root2: "root2",
      },
    },
  }

  const store = createStore(reducer, initialState)

  store.dispatch(unmountComponent({ componentPath: ["root", "child"] }))
  store.dispatch(unmountComponent({ componentPath: ["root2"] }))

  expect(store.getState()).toEqual({
    root: {
      state: {
        root: "root",
      },
    },
  })
})

test("updateState: propagates update up the tree", () => {
  const initialState = {
    root: {
      state: {
        root: "root",
      },
      child: {
        state: {
          child: "child",
        },
      },
    },
    root2: {
      state: {
        root2: "root2",
      },
    },
  }

  const store = createStore(reducer, initialState)

  store.dispatch(
    updateState({
      componentPath: ["root", "child"],
      state: { child: "updated child", root: "updated root" },
    })
  )

  expect(store.getState()).toEqual({
    root: {
      state: {
        root: "updated root",
      },
      child: {
        state: {
          child: "updated child",
        },
      },
    },
    root2: {
      state: {
        root2: "root2",
      },
    },
  })
})

test("updateState: should throw if there is an attempt to update a non existant property", () => {
  const initialState = {
    root: {
      state: {
        root: "root",
      },
      child: {
        state: {
          child: "child",
        },
      },
    },
    root2: {
      state: {
        root2: "root2",
      },
    },
  }

  const store = createStore(reducer, initialState)

  expect(() =>
    store.dispatch(
      updateState({
        componentPath: ["root", "child"],
        state: { idontexist: "adjfasdf" },
      })
    )
  ).toThrow()
})
