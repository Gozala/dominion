/* @flow */

import * as DOMinion from "../"
import { createHost, diff } from "./Util"
import test from "blue-tape"

test("empty div", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])

  test.deepEqual(
    diff(v1, v2),
    ["selectChildren()", 'insertElement("div")'],
    "insert div"
  )
})

test("attributes", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v3 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttribute("class", "standard"),
        DOMinion.setAttribute("e-text", "custom")
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

test("properties", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [DOMinion.setAttribute("class", "standard")],
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
      'setAttribute("class", "standard")'
    ],
    "add div with attribute"
  )

  const v3 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttribute("e-text", "custom"),
        DOMinion.property("testProp", 5)
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

  const v4 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttribute("e-text", "custom"),
        DOMinion.property("otherProp", null)
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

  const v5 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttribute("e-text", "custom"),
        DOMinion.property("otherProp", true)
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

test("style rules", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.style({
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

  const v3 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.style({
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

  const v4 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.style({
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

  const v5 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.style({
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

test("insertText", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])

  test.deepEqual(
    diff(v1, v2),
    ["selectChildren()", 'insertText("hello")'],
    "insert text node"
  )
})

test("insertComment", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createComment("whatever")])

  test.deepEqual(
    diff(v1, v2),
    ["selectChildren()", 'insertComment("whatever")'],
    "insert comment node"
  )
})

test("insertElement", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])

  test.deepEqual(
    diff(v1, v2),
    ["selectChildren()", 'insertElement("div")'],
    "insert div node"
  )
})

test("insertElementNS", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  test.deepEqual(
    diff(v1, v2),
    [
      "selectChildren()",
      'insertElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "insert svg:circle node"
  )
})

test("replaceWithText", async test => {
  const tree = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  test.deepEqual(
    diff(v1, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithText("hello")'],
    "replace div with text node"
  )

  test.deepEqual(diff(v2, tree), [], "no changes")

  test.deepEqual(
    diff(v3, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithText("hello")'],
    "replace comment with text node"
  )

  test.deepEqual(
    diff(v4, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithText("hello")'],
    "replace elementNS with text node"
  )
})

test("replaceWithComment", async test => {
  const tree = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  test.deepEqual(
    diff(v1, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithComment("whatever")'],
    "replace div with comment node"
  )

  test.deepEqual(
    diff(v2, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithComment("whatever")'],
    "replace text node with comment node"
  )

  test.deepEqual(diff(v3, tree), [], "no difference")

  test.deepEqual(
    diff(v4, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithComment("whatever")'],
    "replace elementNS with comment node"
  )
})

test("replaceWithElement", async test => {
  const tree = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )
  const v5 = DOMinion.createHost([], [DOMinion.createElement("h1")])

  test.deepEqual(diff(v1, tree), [], "no diff")

  test.deepEqual(
    diff(v2, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithElement("div")'],
    "replace text node with element node"
  )

  test.deepEqual(
    diff(v3, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithElement("div")'],
    "replace comment node with element node"
  )

  test.deepEqual(
    diff(v4, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithElement("div")'],
    "replace elementNS with element node"
  )

  test.deepEqual(
    diff(v5, tree),
    ["selectChildren()", "selectSibling(1)", 'replaceWithElement("div")'],
    "replace h1 element with div element"
  )
})

test("replaceWithElementNS", async test => {
  const tree = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )
  const v5 = DOMinion.createHost([], [DOMinion.createElement("circle")])
  const v6 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "svg")]
  )
  const v7 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/TR/html4/", "circle")]
  )

  test.deepEqual(
    diff(v1, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace element node with elementNS"
  )

  test.deepEqual(
    diff(v2, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace text node with elementNS"
  )

  test.deepEqual(
    diff(v3, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace comment node with elementNS node"
  )

  test.deepEqual(diff(v4, tree), [], "no diff")

  test.deepEqual(
    diff(v5, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace circle node with svg:cicrle node"
  )

  test.deepEqual(
    diff(v6, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace svg:svg node with svg:cicrle node"
  )

  test.deepEqual(
    diff(v7, tree),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElementNS("http://www.w3.org/2000/svg", "circle")'
    ],
    "replace html4:circle node with svg:cicrle node"
  )
})

test("text setTextData", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("")]),
      DOMinion.createHost([], [DOMinion.createTextNode("hello")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("hello")'],
    "add text data"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("hello")]),
      DOMinion.createHost([], [DOMinion.createTextNode("goodbye")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("goodbye")'],
    "change text data"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("hello")]),
      DOMinion.createHost([], [DOMinion.createTextNode("")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("")'],
    "remove text data"
  )
})

test("comment setTextData", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("")]),
      DOMinion.createHost([], [DOMinion.createComment("hello")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("hello")'],
    "add text data"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("hello")]),
      DOMinion.createHost([], [DOMinion.createComment("goodbye")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("goodbye")'],
    "change text data"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("hello")]),
      DOMinion.createHost([], [DOMinion.createComment("")])
    ),
    ["selectChildren()", "selectSibling(1)", 'setTextData("")'],
    "remove text data"
  )
})

test("text editTextData", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("my name is")]),
      DOMinion.createHost([], [DOMinion.createTextNode("Hello, my name is")])
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'editTextData(0, 0, "Hello, ", "")'
    ],
    "add text in front"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("my name is")]),
      DOMinion.createHost([], [DOMinion.createTextNode("my name is Jack")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(0, 0, "", " Jack")'],
    "add text in the back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createTextNode("my name is")]),
      DOMinion.createHost(
        [],
        [DOMinion.createTextNode("Hello, my name is Jack")]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'editTextData(0, 0, "Hello, ", " Jack")'
    ],
    "add text in both in front & back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createTextNode("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createTextNode("my name is Jack")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(7, 0, "", "")'],
    "delete text from the front"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createTextNode("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createTextNode("Hello, my name is J")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(0, 3, "", "")'],
    "delete text from the back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createTextNode("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createTextNode("my name is")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(7, 5, "", "")'],
    "delete text from the both sides"
  )
})

test("comment editTextData", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("my name is")]),
      DOMinion.createHost([], [DOMinion.createComment("Hello, my name is")])
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'editTextData(0, 0, "Hello, ", "")'
    ],
    "add text in front"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("my name is")]),
      DOMinion.createHost([], [DOMinion.createComment("my name is Jack")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(0, 0, "", " Jack")'],
    "add text in the back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createComment("my name is")]),
      DOMinion.createHost(
        [],
        [DOMinion.createComment("Hello, my name is Jack")]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'editTextData(0, 0, "Hello, ", " Jack")'
    ],
    "add text in both in front & back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createComment("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createComment("my name is Jack")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(7, 0, "", "")'],
    "delete text from the front"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createComment("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createComment("Hello, my name is J")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(0, 3, "", "")'],
    "delete text from the back"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createComment("Hello, my name is Jack")]
      ),
      DOMinion.createHost([], [DOMinion.createComment("my name is")])
    ),
    ["selectChildren()", "selectSibling(1)", 'editTextData(7, 5, "", "")'],
    "delete text from the both sides"
  )
})

test("setAttribute", async test => {})

test("setAttributeNS", async test => {})

test("removeAttribute", async test => {})

test("removeAttributeNS", async test => {})

test("assignProperty", async test => {})

test("deleteProperty", async test => {})

test("setStyleRule", async test => {})

test("removeStyleRule", async test => {})
