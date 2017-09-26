/* @flow */

import * as DOM from "../"
import { createHost, diff } from "./Util"
import test from "blue-tape"

test("empty div", async test => {
  const v1 = DOM.createHost()
  const v2 = DOM.createHost([], [DOM.createElement("div")])

  test.deepEqual(
    diff(v1, v2),
    ["selectChildren()", 'insertElement("div")'],
    "insert div"
  )
})

test("div with attributes", async test => {
  const v1 = DOM.createHost()
  const v2 = DOM.createHost([], [DOM.createElement("div")])
  const v3 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.setAttribute("class", "standard"),
        DOM.setAttribute("e-text", "custom")
      ])
    ]
  )

  test.deepEqual(
    diff(v2, v3),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setAttribute("class", "standard")',
      'setAttribute("e-text", "custom")'
    ],
    "add two attributes to an empty div"
  )

  test.deepEqual(
    diff(v1, v3),
    [
      "selectChildren()",
      'insertElement("div")',
      "selectSibling(1)",
      'setAttribute("class", "standard")',
      'setAttribute("e-text", "custom")'
    ],
    "insert div with two attributes"
  )
})

test("div with properties", async test => {
  const v1 = DOM.createHost()
  const v2 = DOM.createHost(
    [],
    [DOM.createElement("div", [DOM.setAttribute("class", "standard")], [])]
  )

  test.deepEqual(
    diff(v1, v2),
    [
      "selectChildren()",
      'insertElement("div")',
      "selectSibling(1)",
      'setAttribute("class", "standard")'
    ],
    "add div with attribute"
  )

  const v3 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.setAttribute("e-text", "custom"),
        DOM.property("testProp", 5)
      ])
    ]
  )

  test.deepEqual(
    diff(v2, v3),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("testProp", 5)',
      'removeAttribute("class")',
      'setAttribute("e-text", "custom")'
    ],
    "set / remove attribute and assign property"
  )

  const v4 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.setAttribute("e-text", "custom"),
        DOM.property("otherProp", null)
      ])
    ]
  )

  test.deepEqual(
    diff(v3, v4),
    [
      "selectChildren()",
      "selectSibling(1)",
      'deleteProperty("testProp")',
      'assignProperty("otherProp", null)'
    ],
    "set / remove attribute and assign property"
  )

  const v5 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.setAttribute("e-text", "custom"),
        DOM.property("otherProp", true)
      ])
    ]
  )

  test.deepEqual(
    diff(v4, v5),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("otherProp", true)'
    ],
    "update property"
  )
})

test("div with style rules", async test => {
  const v1 = DOM.createHost()
  const v2 = DOM.createHost(
    [],
    [
      DOM.createElement(
        "div",
        [
          DOM.style({
            backgroundColor: "red"
          })
        ],
        []
      )
    ]
  )

  test.deepEqual(
    diff(v1, v2),
    [
      "selectChildren()",
      'insertElement("div")',
      "selectSibling(1)",
      'setStyleRule("backgroundColor", "red")'
    ],
    "add div with style"
  )

  const v3 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.style({
          color: "white"
        })
      ])
    ]
  )

  test.deepEqual(
    diff(v2, v3),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeStyleRule("backgroundColor")',
      'setStyleRule("color", "white")'
    ],
    "set / remove style rule"
  )

  const v4 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.style({
          color: null,
          backgroundColor: "blue"
        })
      ])
    ]
  )

  test.deepEqual(
    diff(v3, v4),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeStyleRule("color")',
      'setStyleRule("backgroundColor", "blue")'
    ],
    "set / remove style rules"
  )

  const v5 = DOM.createHost(
    [],
    [
      DOM.createElement("div", [
        DOM.style({
          color: "white",
          backgroundColor: "green"
        })
      ])
    ]
  )

  test.deepEqual(
    diff(v4, v5),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setStyleRule("color", "white")',
      'setStyleRule("backgroundColor", "green")'
    ],
    "update / add style rule"
  )
})
