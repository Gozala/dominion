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

test("setAttribute", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      )
    ),
    [],
    "attribute present in both versions"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div", [])]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'setAttribute("x", "50")'],
    "attribute was added"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "10")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'setAttribute("x", "50")'],
    "update attribute value"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeAttributeNS("http://www.w3.org/2000/svg", "x")',
      'setAttribute("x", "50")'
    ],
    "namespaced attributes are different"
  )
})

test("setAttributeNS", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      )
    ),
    [],
    "attribute present in both versions"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div", [])]),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "50")'
    ],
    "attribute was added"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "5")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "5")'
    ],
    "update attribute value"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeAttributeNS("http://www.w3.org/2000/", "x")',
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "50")'
    ],
    "namespaced attributes are different"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeAttribute("x")',
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "50")'
    ],
    "namespaced attributes are different"
  )
})

test("removeAttribute", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost([], [DOMinion.createElement("div", [])])
    ),
    ["selectChildren()", "selectSibling(1)", 'removeAttribute("x")'],
    "attribute was added"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'setAttribute("x", "")'],
    "if attribute value is omitted it's empty string"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", null)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'removeAttribute("x")'],
    "attribute value was null"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.setAttribute("x", "")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'setAttribute("x", "")'],
    "attribute value was ''"
  )
})

test("removeAttributeNS", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost([], [DOMinion.createElement("div", [])])
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeAttributeNS("http://www.w3.org/2000/svg", "x")'
    ],
    "attribute was added"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "")'
    ],
    "if attribute value is omitted it's empty string"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", null)
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeAttributeNS("http://www.w3.org/2000/svg", "x")'
    ],
    "attribute value was null"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "")
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setAttributeNS("http://www.w3.org/2000/svg", "x", "")'
    ],
    "attribute value was ''"
  )
})

test("assignProperty", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 50)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("x", 50)'],
    "assign number property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 50)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 50)])]
      )
    ),
    [],
    "proprety unchanged"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 51)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 50)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("x", 50)'],
    "proprety unchanged"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", true)])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("isHidden", true)'
    ],
    "set false expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", false)])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("isHidden", false)'
    ],
    "set true expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", false)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", true)])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("isHidden", true)'
    ],
    "update boolean property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", false)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", null)])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("isHidden", null)'
    ],
    "update boolean property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", false)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("isHidden", "Yes")])]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("isHidden", "Yes")'
    ],
    "update boolean property to string"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "cat")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("value", "cat")'],
    "set string expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "cat")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "cat")])]
      )
    ),
    [],
    "string properties match"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "cat")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "dog")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("value", "dog")'],
    "override string property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "cat")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("value", "cat")'],
    "set string expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("value", "")'],
    "set empty string expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", null)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'assignProperty("value", null)'],
    "set null expando property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", null)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", null)])]
      )
    ),
    [],
    "same null property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", undefined)])]
      )
    ),
    [],
    "property with undefined as value is treated as delete property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value")])]
      )
    ),
    [],
    "optional fallback value defaults to undefined"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", undefined)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value")])]
      )
    ),
    [],
    "no proprety values"
  )
})

test("deleteProperty", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("x", 50)])]
      ),
      DOMinion.createHost([], [DOMinion.createElement("div")])
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("x")'],
    "delete missing property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "what")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("value")'],
    "delete property with no value"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", "what")])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("value")'],
    "delete property with no value"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", true)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", undefined)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("value")'],
    "delete property with no value"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", null)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", undefined)])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("value")'],
    "delete null property"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value", null)])]
      ),
      DOMinion.createHost(
        [],
        [DOMinion.createElement("div", [DOMinion.property("value")])]
      )
    ),
    ["selectChildren()", "selectSibling(1)", 'deleteProperty("value")'],
    "delete null property"
  )
})

test("setStyleRule", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.style({
              backgroundColor: "red",
              position: null
            })
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setStyleRule("backgroundColor", "red")'
    ],
    "set backgroundColor"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.style({
              display: "block"
            })
          ])
        ]
      ),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.style({
              backgroundColor: "red",
              display: null
            })
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setStyleRule("backgroundColor", "red")',
      'removeStyleRule("display")'
    ],
    "set backgroundColor remove display"
  )

  test.deepEqual(
    diff(
      DOMinion.createHost([], [DOMinion.createElement("div")]),
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.style({
              color: "white",
              backgroundColor: "red"
            }),
            DOMinion.style({
              backgroundColor: "blue"
            })
          ])
        ]
      )
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'setStyleRule("color", "white")',
      'setStyleRule("backgroundColor", "blue")'
    ],
    "color mix"
  )
})

test("removeStyleRule", async test => {
  test.deepEqual(
    diff(
      DOMinion.createHost(
        [],
        [
          DOMinion.createElement("div", [
            DOMinion.style({
              backgroundColor: "red",
              position: null
            })
          ])
        ]
      ),
      DOMinion.createHost([], [DOMinion.createElement("div")])
    ),
    [
      "selectChildren()",
      "selectSibling(1)",
      'removeStyleRule("backgroundColor")'
    ],
    "remove backgroundColor"
  )
})

test("nested children", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.setAttribute("id", "main"),
          DOMinion.property("autofocus", true),
          DOMinion.style({
            backgroundColor: "blue",
            color: "white"
          })
        ],
        [
          DOMinion.createTextNode("hi there"),
          DOMinion.createComment("this is"),
          DOMinion.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
            [
              DOMinion.setAttribute("cx", "40"),
              DOMinion.setAttribute("cy", "50"),
              DOMinion.setAttribute("r", "26")
            ],
            [
              DOMinion.createElement(
                "span",
                [],
                [DOMinion.createTextNode("what's up ?")]
              )
            ]
          )
        ]
      )
    ]
  )

  test.deepEqual(
    diff(v1, v2),
    [
      "selectChildren()",
      'insertElement("div")',
      "selectSibling(1)",
      'assignProperty("autofocus", true)',
      'setAttribute("id", "main")',
      'setStyleRule("backgroundColor", "blue")',
      'setStyleRule("color", "white")',
      "selectChildren()",
      'insertText("hi there")',
      "selectSibling(1)",
      'insertComment("this is")',
      "selectSibling(1)",
      'insertElementNS("http://www.w3.org/2000/svg", "circle")',
      "selectSibling(1)",
      'setAttribute("cx", "40")',
      'setAttribute("cy", "50")',
      'setAttribute("r", "26")',
      "selectChildren()",
      'insertElement("span")',
      "selectSibling(1)",
      "selectChildren()",
      `insertText("what's up ?")`
    ],
    "initial tree"
  )

  const v3 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.setAttribute("id", "main"),
          DOMinion.property("autofocus", true),
          DOMinion.style({
            backgroundColor: "blue",
            color: "white"
          })
        ],
        [
          DOMinion.createTextNode("hi there"),
          DOMinion.createComment("this is"),
          DOMinion.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
            [
              DOMinion.setAttribute("cx", "40"),
              DOMinion.setAttribute("cy", "50"),
              DOMinion.setAttribute("r", "26")
            ],
            [
              DOMinion.createElement(
                "span",
                [],
                [DOMinion.createTextNode("bye")]
              )
            ]
          )
        ]
      )
    ]
  )

  test.deepEqual(
    diff(v2, v3),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(3)",
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      'setTextData("bye")'
    ],
    "nested text update"
  )

  const v4 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.setAttribute("id", "main"),
          DOMinion.property("autofocus", true),
          DOMinion.style({
            backgroundColor: "blue",
            color: "white"
          })
        ],
        [DOMinion.createTextNode("hi there")]
      )
    ]
  )

  test.deepEqual(
    diff(v3, v4),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "some children got removed"
  )

  const v5 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.setAttribute("id", "main"),
          DOMinion.property("autofocus", true),
          DOMinion.style({
            backgroundColor: "blue",
            color: "white"
          })
        ],
        [
          DOMinion.createElement(
            "h1",
            [DOMinion.setAttribute("class", "title")],
            [DOMinion.createTextNode("Example")]
          ),
          DOMinion.createElement("p")
        ]
      )
    ]
  )

  test.deepEqual(
    diff(v4, v5),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElement("h1")',
      'setAttribute("class", "title")',
      "selectChildren()",
      'insertText("Example")',
      "selectParent()",
      'insertElement("p")'
    ],
    "replace child and add one"
  )

  const v6 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement(
        "div",
        [
          DOMinion.setAttribute("id", "main"),
          DOMinion.property("autofocus", false),
          DOMinion.style({
            backgroundColor: "blue",
            color: "white"
          })
        ],
        [
          DOMinion.createElement(
            "h1",
            [],
            [DOMinion.createTextNode("Example")]
          ),
          DOMinion.createElement("p", [], [DOMinion.createTextNode("Hi")])
        ]
      )
    ]
  )

  test.deepEqual(
    diff(v5, v6),
    [
      "selectChildren()",
      "selectSibling(1)",
      'assignProperty("autofocus", false)',
      "selectChildren()",
      "selectSibling(1)",
      'removeAttribute("class")',
      "selectSibling(1)",
      "selectChildren()",
      'insertText("Hi")'
    ],
    "change property, remove child's attribute, insert grand grand child"
  )
})

test("indexed element ordering", async test => {
  const _ = DOMinion.createHost()
  const abc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(_, abc),
    [
      "selectChildren()",
      'insertElement("ul")',
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")',
      "selectSibling(1)",
      'insertElement("li")',
      "selectSibling(1)",
      'insertElement("li")'
    ],
    "[] -> [a, b, c]"
  )

  const bac = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["b", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, bac),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "shiftSiblings(1)"
    ],
    "[a, b, c] -> [b, a, c]"
  )

  const cba = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["c", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, cba),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "stashNextSibling(1)",
      "shiftSiblings(1)",
      "selectSibling(2)",
      "insertStashedNode(1)"
    ],
    "[a, b, c] -> [c, b, a]"
  )

  test.deepEqual(
    diff(bac, cba),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "shiftSiblings(2)"
    ],
    "[b, a, c] -> [c, b, a]"
  )

  const bca = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, bca),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "stashNextSibling(1)",
      "selectSibling(2)",
      "insertStashedNode(1)"
    ],
    "[a, b, c] -> [b, c, a]"
  )

  test.deepEqual(
    diff(bac, bca),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "shiftSiblings(1)"
    ],
    "[b, a, c] -> [b, c, a]"
  )

  test.deepEqual(
    diff(cba, bca),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "shiftSiblings(1)"
    ],
    "[c, b, a] -> [b, c, a]"
  )

  const acb = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, acb),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "shiftSiblings(1)"
    ],
    "[a, b, c] -> [a, c, b]"
  )

  test.deepEqual(
    diff(bac, acb),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "stashNextSibling(1)",
      "selectSibling(2)",
      "insertStashedNode(1)"
    ],
    "[b, a, c] -> [a, c, b]"
  )

  test.deepEqual(
    diff(cba, acb),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "shiftSiblings(2)"
    ],
    "[c, b, a] -> [a, c, b]"
  )

  test.deepEqual(
    diff(bca, acb),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "stashNextSibling(1)",
      "shiftSiblings(1)",
      "selectSibling(2)",
      "insertStashedNode(1)"
    ],
    "[b, c, a] -> [a, c, b]"
  )
})

test("indexed element random insert", async test => {
  const abc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  const abcX = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, abcX),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(3)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, b, c, X]"
  )

  const Xabc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["X", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, Xabc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")'
    ],
    "[a, b, c] -> [X, a, b, c]"
  )

  const aXbc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, aXbc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, X, b, c]"
  )

  const abXc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, abXc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(2)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, b, X, c]"
  )

  const abcXY = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, abcXY),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(3)",
      'insertElement("li")',
      "selectSibling(1)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, b, c, X, Y]"
  )

  const abXcY = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, abXcY),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(2)",
      'insertElement("li")',
      "selectSibling(2)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, b, X, c, Y]"
  )

  const aXbcY = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, aXbcY),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      'insertElement("li")',
      "selectSibling(3)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, X, b, c, Y]"
  )

  const XabcY = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["X", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, XabcY),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")',
      "selectSibling(4)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [X, a, b, c, Y]"
  )

  const XabYc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["X", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, XabYc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")',
      "selectSibling(3)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [X, a, b, Y, c]"
  )

  const XaYbc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["X", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, XaYbc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")',
      "selectSibling(2)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [X, a, Y, b, c]"
  )

  const XYabc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["X", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")],
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, XYabc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      'insertElement("li")',
      "selectSibling(1)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [X, Y, a, b, c]"
  )

  const aXbYc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["X", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["Y", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abc, aXbYc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      'insertElement("li")',
      "selectSibling(2)",
      'insertElement("li")'
    ],
    "[a, b, c] -> [a, X, b, Y, c]"
  )
})

test("indexed element random delete", async test => {
  const abcd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  const abc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, abc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(3)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, b, c]"
  )

  const abd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, abd),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(2)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, b, d]"
  )

  const acd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, acd),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, b, d]"
  )

  const bcd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, bcd),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [b, c, d]"
  )

  const ab = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, ab),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(2)",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, b]"
  )

  const ac = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, ac),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "removeNextSibling()",
      "selectSibling(1)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, c]"
  )

  const ad = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, ad),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a, d]"
  )

  const bd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["b", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, bd),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "selectSibling(1)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [b, d]"
  )

  const bc = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["b", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, bc),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "selectSibling(2)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [b, c]"
  )

  const cd = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["c", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, cd),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [c, d]"
  )

  const a = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [["a", DOMinion.createElement("li")]]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, a),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(1)",
      "removeNextSibling()",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [a]"
  )

  const b = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [["b", DOMinion.createElement("li")]]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, b),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "selectSibling(1)",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [b]"
  )

  const c = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [["c", DOMinion.createElement("li")]]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, c),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "removeNextSibling()",
      "selectSibling(1)",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [c]"
  )

  const d = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [["d", DOMinion.createElement("li")]]
      )
    ]
  )

  test.deepEqual(
    diff(abcd, d),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> [d]"
  )

  const _ = DOMinion.createHost([], [DOMinion.createIndexedElement("ul")])

  test.deepEqual(
    diff(abcd, _),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "removeNextSibling()",
      "removeNextSibling()",
      "removeNextSibling()",
      "removeNextSibling()"
    ],
    "[a, b, c, d] -> []"
  )
})

test("indexed element insert+remove+reorder", async test => {
  const abscdef = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["a", DOMinion.createElement("li")],
          ["b", DOMinion.createElement("li")],
          ["s", DOMinion.createElement("li")],
          ["c", DOMinion.createElement("li")],
          ["d", DOMinion.createElement("li")],
          ["e", DOMinion.createElement("li")],
          ["f", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  const dsfegh = DOMinion.createHost(
    [],
    [
      DOMinion.createIndexedElement(
        "ul",
        [],
        [
          ["d", DOMinion.createElement("li")],
          ["s", DOMinion.createElement("li")],
          ["f", DOMinion.createElement("li")],
          ["e", DOMinion.createElement("li")],
          ["g", DOMinion.createElement("li")],
          ["h", DOMinion.createElement("li")]
        ]
      )
    ]
  )

  test.deepEqual(
    diff(abscdef, dsfegh),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()", // []abscdef
      "removeNextSibling()", // []bscdef
      "removeNextSibling()", // []scdef

      "shiftSiblings(2)", // []dscef
      "selectSibling(2)", // d[s]cef
      "removeNextSibling()", // d[s]ef
      "shiftSiblings(1)", // d[s]fe
      "selectSibling(2)", // dsf[e]
      'insertElement("li")', // dsf[e]g
      "selectSibling(1)", // dsfe[g]
      'insertElement("li")' // dsfe[g]h
    ],
    "[a b s c d e f] -> [d s f e g h]"
  )
})

test("thunk", async test => {
  let greeted = 0
  const greeting = (name: string, color: string) => {
    greeted++
    return DOMinion.createElement(
      "div",
      [DOMinion.setAttribute("role", "greeting"), DOMinion.style({ color })],
      [DOMinion.createTextNode("Hello "), DOMinion.createTextNode(name)]
    )
  }

  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createThunk(greeting, "Jack", "red")]
  )
  const v3 = DOMinion.createHost(
    [],
    [DOMinion.createThunk(greeting, "Jane", "red")]
  )
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createThunk(greeting, "Jane", "green")]
  )

  const v5 = DOMinion.createHost(
    [],
    [DOMinion.createThunk(greeting, "Jane", "green")]
  )

  test.equal(greeted, 0, "Thunks are not called during tree construction")
  const v6 = DOMinion.createHost([], [greeting("Jane", "green")])
  greeted = 0

  test.deepEqual(
    diff(v1, v2),
    [
      "selectChildren()",
      'insertElement("div")',
      "selectSibling(1)",
      'setAttribute("role", "greeting")',
      'setStyleRule("color", "red")',
      "selectChildren()",
      'insertText("Hello ")',
      "selectSibling(1)",
      'insertText("Jack")'
    ],
    "bulid a lazy tree"
  )
  test.equal(greeted, 1, "thunk was invoked once during diffing")

  test.deepEqual(
    diff(v2, v3),
    [
      "selectChildren()",
      "selectSibling(1)",
      "selectChildren()",
      "selectSibling(2)",
      'setTextData("Jane")'
    ],
    "change nested text node data"
  )
  test.equal(greeted, 2, "thunk was invoked once during diffing")

  test.deepEqual(
    diff(v3, v4),
    ["selectChildren()", "selectSibling(1)", 'setStyleRule("color", "green")'],
    "change node style rule"
  )
  test.equal(greeted, 3, "thunk was invoked once during diffing")

  test.deepEqual(diff(v4, v5), [], "thunks are equivalent")
  test.equal(
    greeted,
    3,
    "thunk was invoked as it was diffed against equal thunk"
  )

  test.deepEqual(
    diff(v5, v6),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElement("div")',
      'setAttribute("role", "greeting")',
      'setStyleRule("color", "green")',
      "selectChildren()",
      'insertText("Hello ")',
      "selectSibling(1)",
      'insertText("Jane")'
    ],
    "diffing thunk vs non thunk replaced node"
  )

  test.equal(greeted, 3, "thunk was not invoked as it was already computed")

  test.deepEqual(
    diff(v6, v5),
    [
      "selectChildren()",
      "selectSibling(1)",
      'replaceWithElement("div")',
      'setAttribute("role", "greeting")',
      'setStyleRule("color", "green")',
      "selectChildren()",
      'insertText("Hello ")',
      "selectSibling(1)",
      'insertText("Jane")'
    ],
    "diffing non thunk vs thunk replaces node"
  )

  test.equal(greeted, 3, "thunk was not invoked as it was already computed")

  test.deepEqual(
    diff(v4, v3),
    ["selectChildren()", "selectSibling(1)", 'setStyleRule("color", "red")'],
    "change node style rule"
  )
  test.equal(
    greeted,
    3,
    "both thunk were already computed so view isn't invoked"
  )
})
