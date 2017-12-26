import { __TEST__ } from "../helpers"

const {
  splitValues,
  updateStateAtPath,
  getStateAtPath,
  upOneLevel,
  updateStateTree,
  getAccessibleState,
  addStateAtPath,
  removeStateAtPath,
} = __TEST__

test("splitValues", () => {
  const localState = {
    a: "a value",
    b: "b value",
  }

  const values = {
    a: "new a value",
    c: "new c value",
  }

  const result = {
    localValues: {
      a: "new a value",
    },
    parentValues: {
      c: "new c value",
    },
  }

  expect(splitValues(localState, values)).toEqual(result)
})

test("getState", () => {
  const uiState = {
    root: {
      state: {
        rootval: "rootval",
      },
      child: {
        state: {
          childval: "childval",
          childval2: "childval2",
        },
      },
    },
  }

  const path = ["root", "child"]

  const result = getStateAtPath(uiState, path)

  const answer = {
    childval: "childval",
    childval2: "childval2",
  }

  expect(result).toEqual(answer)
})

test("updateStateAtPath", () => {
  const uiState = {
    root: {
      state: {
        rootval: "rootval",
      },
      child: {
        state: {
          childval: "childval",
          childval2: "childval2",
        },
      },
    },
  }

  const path = ["root", "child"]

  const values = {
    childval: "new childval",
    notpresentval: "ops",
  }

  const result = updateStateAtPath(uiState, path, values)

  const answer = {
    root: {
      state: {
        rootval: "rootval",
      },
      child: {
        state: {
          childval: "new childval",
          childval2: "childval2",
        },
      },
    },
  }

  expect(result).toEqual(answer)
})

test("upOneLevel", () => {
  const path = ["root", "parent", "child"]

  expect(upOneLevel(path)).toEqual(["root", "parent"])
})

test("upOneLevel at root component", () => {
  const path = ["root"]

  expect(upOneLevel(path)).toEqual([])
})

test("Updates a nested state tree", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent", "ChildComponent1"]

  const values = {
    child1Prop: "Updated_child1PropValue",
    rootProp: "Updated_rootPropValue",
  }

  const correctNextState = {
    RootComponent: {
      state: {
        rootProp: "Updated_rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "Updated_child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  expect(updateStateTree(uiState, path, values)).toEqual(correctNextState)
})

test("updateStateTree: Supports updater functions (prevValuee) => nextValue", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent", "ChildComponent1"]

  const values = {
    child1Prop: "Updated_child1PropValue",
    rootProp: prev => `Updated_${prev}`,
  }

  const correctNextState = {
    RootComponent: {
      state: {
        rootProp: "Updated_rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "Updated_child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  expect(updateStateTree(uiState, path, values)).toEqual(correctNextState)
})

test("getAccesibleState: Child access parent state", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent", "ChildComponent1"]

  const result = getAccessibleState(uiState, path)

  const answer = {
    rootProp: "rootPropValue",
    child1Prop: "child1PropValue",
    child2Prop: "child2PropValue",
  }

  expect(result).toEqual(answer)
})

test("getAccesibleState: Parent does not access child state", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent1: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent"]

  const result = getAccessibleState(uiState, path)

  const answer = {
    rootProp: "rootPropValue",
  }

  expect(result).toEqual(answer)
})

test("addStateAtPath:", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent", "ChildComponent", "GrandChildComponent"]

  const state = {
    grandChildProp: "grandChildProp",
  }

  const result = addStateAtPath(uiState, path, state)

  const answer = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
        GrandChildComponent: {
          state: {
            grandChildProp: "grandChildProp",
          },
        },
      },
    },
  }

  expect(result).toEqual(answer)
})

test("removeStateAtPath:", () => {
  const uiState = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
      ChildComponent: {
        state: {
          child1Prop: "child1PropValue",
          child2Prop: "child2PropValue",
        },
      },
    },
  }

  const path = ["RootComponent", "ChildComponent"]

  const result = removeStateAtPath(uiState, path)

  const answer = {
    RootComponent: {
      state: {
        rootProp: "rootPropValue",
      },
    },
  }

  expect(result).toEqual(answer)
})
