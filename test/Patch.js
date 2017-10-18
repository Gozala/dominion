/* @flow */

import * as DOMinion from "../"
import { createHostMount, applyDiff, createHost } from "./Util"
import test from "blue-tape"

test("nothing", async test => {
  const tree = createHostMount()
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost()

  test.deepEqual(applyDiff(tree, v1, v2).innerHTML, "", "nothing")
})

test("empty div", async test => {
  const tree = createHostMount()
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])

  test.deepEqual(applyDiff(tree, v1, v2).innerHTML, "<div></div>", "div added")
})

test("attributes", async test => {
  const tree = createHostMount()
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
    applyDiff(tree, v1, v2).innerHTML,
    "<div></div>",
    "empty div added to the tree"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    '<div class="standard" e-text="custom"></div>',
    "insert div with two attributes"
  )
})

test("properties", async test => {
  const tree = createHostMount()

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
    applyDiff(tree, v1, v2).innerHTML,
    '<div class="standard"></div>',
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
    (applyDiff(tree, v2, v3).querySelector("div"): any).testProp,
    5,
    "testProp=5"
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
    (applyDiff(tree, v3, v4).querySelector("div"): any).otherProp,
    null,
    "otherProp=null"
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
    (applyDiff(tree, v4, v5).querySelector("div"): any).otherProp,
    true,
    "otherProp=true"
  )
})

test("style rules", async test => {
  const tree = createHostMount()
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
    applyDiff(tree, v1, v2).innerHTML,
    '<div style="background-color: red;"></div>',
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
    applyDiff(tree, v2, v3).innerHTML,
    '<div style="color: white;"></div>',
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
    applyDiff(tree, v3, v4).innerHTML,
    '<div style="background-color: blue;"></div>',
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
    applyDiff(tree, v4, v5).innerHTML,
    '<div style="background-color: green; color: white;"></div>',
    "update / add style rule"
  )

  const mixed = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.style({
          color: "white",
          fontSize: "20px"
        }),
        DOMinion.style({
          color: "yellow",
          backgroundColor: "green"
        })
      ])
    ]
  )

  test.deepEqual(
    applyDiff(createHostMount(), v1, mixed).innerHTML,
    '<div style="color: yellow; font-size: 20px; background-color: green;"></div>',
    "add div with style mixture"
  )

  const premixed = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.style({
          fontSize: "20px",
          color: "yellow",
          backgroundColor: "green"
        })
      ])
    ]
  )

  test.deepEqual(
    applyDiff(createHostMount(), mixed, premixed).innerHTML,
    "",
    "there is no diff between mixed styles or combined"
  )
})

test("insertText", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])

  test.deepEqual(
    applyDiff(createHostMount(), v1, v2).innerHTML,
    "hello",
    "insert text node"
  )
})

test("insertComment", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createComment("whatever")])

  test.deepEqual(
    applyDiff(createHostMount(), v1, v2).innerHTML,
    "<!--whatever-->",
    "insert comment node"
  )
})

test("insertElement", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])

  test.deepEqual(
    applyDiff(createHostMount(), v1, v2).innerHTML,
    "<div></div>",
    "insert div node"
  )
})

test("insertElementNS", async test => {
  const v1 = DOMinion.createHost()
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  const { namespaceURI, localName } = Object(
    applyDiff(createHostMount(), v1, v2).firstElementChild
  )

  test.deepEqual(
    { namespaceURI, localName },
    {
      namespaceURI: "http://www.w3.org/2000/svg",
      localName: "circle"
    },
    "insert svg:circle node"
  )
})

test("replaceWithText", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "hello",
    "create the text node"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "<div></div>",
    "replace the text node with div"
  )

  test.deepEqual(
    applyDiff(tree, v2, v1).innerHTML,
    "hello",
    "replace div with text node"
  )

  test.deepEqual(
    applyDiff(tree, v1, v3).innerHTML,
    "<!--whatever-->",
    "replace text node with a comment node"
  )

  const { namespaceURI, localName } = Object(
    applyDiff(tree, v3, v4).firstElementChild
  )

  test.deepEqual(
    { namespaceURI, localName },
    { namespaceURI: "http://www.w3.org/2000/svg", localName: "circle" },
    "replace comment node with elementNS"
  )

  test.deepEqual(
    applyDiff(tree, v4, v3).innerHTML,
    "<!--whatever-->",
    "replace element ns with a comment node"
  )
})

test("replaceWithComment", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "<div></div>",
    "replace div with comment node"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "hello",
    "replace div with comment node"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "<!--whatever-->",
    "replace text node with comment node"
  )

  const { namespaceURI, localName } = Object(
    applyDiff(tree, v3, v4).firstElementChild
  )

  test.deepEqual(
    { localName, namespaceURI },
    { localName: "circle", namespaceURI: "http://www.w3.org/2000/svg" },
    "replace comment node with elementNS"
  )
})

test("replaceWithElement", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )
  const v5 = DOMinion.createHost([], [DOMinion.createElement("h1")])

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "<div></div>",
    "insert element"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "hello",
    "replace element with text node"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "<!--whatever-->",
    "replace text node with a comment node"
  )

  {
    const { outerHTML, localName, namespaceURI } = Object(
      applyDiff(tree, v3, v4).firstElementChild
    )

    test.deepEqual(
      { localName, namespaceURI, outerHTML },
      {
        localName: "circle",
        namespaceURI: "http://www.w3.org/2000/svg",
        outerHTML: "<circle></circle>"
      },
      "replace comment node with elementNS"
    )
  }

  test.deepEqual(
    applyDiff(tree, v4, v5).innerHTML,
    "<h1></h1>",
    "replace elementNS node with h1"
  )
})

test("replaceWithElementNS", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle")]
  )
  const v2 = DOMinion.createHost([], [DOMinion.createElement("div")])
  const v3 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v4 = DOMinion.createHost([], [DOMinion.createComment("whatever")])
  const v5 = DOMinion.createHost([], [DOMinion.createElement("circle")])
  const v6 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/2000/svg", "svg")]
  )
  const v7 = DOMinion.createHost(
    [],
    [DOMinion.createElementNS("http://www.w3.org/TR/html4/", "circle")]
  )

  {
    const { localName, namespaceURI, outerHTML } = Object(
      applyDiff(tree, v0, v1).firstElementChild
    )
    test.deepEqual(
      { localName, namespaceURI, outerHTML },
      {
        namespaceURI: "http://www.w3.org/2000/svg",
        localName: "circle",
        outerHTML: "<circle></circle>"
      },
      "insert svg:circle"
    )
  }

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "<div></div>",
    "replace svg:circle with div"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "hello",
    "replace div with text node"
  )

  test.deepEqual(
    applyDiff(tree, v3, v4).innerHTML,
    "<!--whatever-->",
    "replace text node with comment node"
  )

  {
    const { outerHTML, localName, namespaceURI } = Object(
      applyDiff(tree, v4, v5).firstElementChild
    )

    test.deepEqual(
      { outerHTML, localName, namespaceURI },
      {
        outerHTML: "<circle></circle>",
        localName: "circle",
        namespaceURI: createHost().namespaceURI
      },
      "replace comment node with html:circle"
    )
  }

  {
    const { outerHTML, localName, namespaceURI } = Object(
      applyDiff(tree, v5, v1).firstElementChild
    )

    test.deepEqual(
      { outerHTML, localName, namespaceURI },
      {
        outerHTML: "<circle></circle>",
        localName: "circle",
        namespaceURI: "http://www.w3.org/2000/svg"
      },
      "replace html:circle with svg:circle"
    )
  }

  {
    const { outerHTML, localName, namespaceURI } = Object(
      applyDiff(tree, v1, v6).firstElementChild
    )

    test.deepEqual(
      { outerHTML, localName, namespaceURI },
      {
        outerHTML: "<svg></svg>",
        localName: "svg",
        namespaceURI: "http://www.w3.org/2000/svg"
      },
      "replace svg:circle svg:svg node"
    )
  }

  {
    const { outerHTML, localName, namespaceURI } = Object(
      applyDiff(tree, v6, v7).firstElementChild
    )

    test.deepEqual(
      { outerHTML, localName, namespaceURI },
      {
        outerHTML: "<circle></circle>",
        localName: "circle",
        namespaceURI: "http://www.w3.org/TR/html4/"
      },
      "replace html4:circle node with svg:cicrle node"
    )
  }
})

test("text setTextData", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createTextNode("")])
  const v2 = DOMinion.createHost([], [DOMinion.createTextNode("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createTextNode("goodbye")])

  test.deepEqual(applyDiff(tree, v0, v1).innerHTML, "", "empty text node")

  test.deepEqual(applyDiff(tree, v1, v2).innerHTML, "hello", "update text data")
  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "goodbye",
    "update text data"
  )
  test.deepEqual(applyDiff(tree, v3, v1).innerHTML, "", "empty text data")
})

test("comment setTextData", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createComment("")])
  const v2 = DOMinion.createHost([], [DOMinion.createComment("hello")])
  const v3 = DOMinion.createHost([], [DOMinion.createComment("goodbye")])

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "<!---->",
    "insert impret comment node"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "<!--hello-->",
    "change text data"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "<!--goodbye-->",
    "change text data"
  )

  test.deepEqual(
    applyDiff(tree, v3, v1).innerHTML,
    "<!---->",
    "remove text data"
  )
})

test("text editTextData", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createTextNode("my name is")])
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createTextNode("Hello, my name is")]
  )
  const v3 = DOMinion.createHost(
    [],
    [DOMinion.createTextNode("my name is Jack")]
  )
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createTextNode("Hello, my name is Jack")]
  )

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "my name is",
    "add text in front"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "Hello, my name is",
    "add text in the back"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "my name is Jack",
    "remove front text remove back text"
  )

  test.deepEqual(
    applyDiff(tree, v3, v4).innerHTML,
    "Hello, my name is Jack",
    "add text in the front"
  )

  test.deepEqual(
    applyDiff(tree, v4, v3).innerHTML,
    "my name is Jack",
    "remove front text"
  )

  test.deepEqual(
    applyDiff(tree, v3, v1).innerHTML,
    "my name is",
    "remove text in the back"
  )
})

test("comment editTextData", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost([], [DOMinion.createComment("my name is")])
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createComment("Hello, my name is")]
  )
  const v3 = DOMinion.createHost(
    [],
    [DOMinion.createComment("my name is Jack")]
  )
  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createComment("Hello, my name is Jack")]
  )

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    "<!--my name is-->",
    "insert comment node"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    "<!--Hello, my name is-->",
    "prepend text"
  )

  test.deepEqual(
    applyDiff(tree, v2, v1).innerHTML,
    "<!--my name is-->",
    "remove text from the front"
  )

  test.deepEqual(
    applyDiff(tree, v1, v3).innerHTML,
    "<!--my name is Jack-->",
    "add text to the end"
  )

  test.deepEqual(
    applyDiff(tree, v3, v1).innerHTML,
    "<!--my name is-->",
    "remove text from the end"
  )

  test.deepEqual(
    applyDiff(tree, v1, v4).innerHTML,
    "<!--Hello, my name is Jack-->",
    "add text at the front and at the end"
  )

  test.deepEqual(
    applyDiff(tree, v4, v1).innerHTML,
    "<!--my name is-->",
    "remove text from frond and end"
  )

  const v5 = DOMinion.createHost(
    [],
    [DOMinion.createComment("Hello, my name is J")]
  )

  test.deepEqual(
    applyDiff(tree, v1, v4).innerHTML,
    "<!--Hello, my name is Jack-->",
    "add text from frond and end"
  )

  test.deepEqual(
    applyDiff(tree, v4, v5).innerHTML,
    "<!--Hello, my name is J-->",
    "Remove last 3 characters"
  )
})

test("setAttribute", async test => {
  const tree = createHostMount()
  const v0 = DOMinion.createHost()
  const v1 = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
  )
  const v2 = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
  )
  const v3 = DOMinion.createHost([], [DOMinion.createElement("div", [])])

  test.deepEqual(
    applyDiff(tree, v0, v1).innerHTML,
    '<div x="50"></div>',
    "insert div with an x attribute"
  )

  test.deepEqual(
    applyDiff(tree, v1, v2).innerHTML,
    '<div x="50"></div>',
    "no changes were made"
  )

  test.deepEqual(
    applyDiff(tree, v2, v3).innerHTML,
    "<div></div>",
    "x attribute as remove"
  )

  test.deepEqual(
    applyDiff(tree, v3, v2).innerHTML,
    '<div x="50"></div>',
    "x attribute was set"
  )

  const v4 = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x", "10")])]
  )

  test.deepEqual(
    applyDiff(tree, v2, v4).innerHTML,
    '<div x="10"></div>',
    "x attribute was updated"
  )

  const v5 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
      ])
    ]
  )

  const div = applyDiff(tree, v4, v5).firstElementChild

  if (div == null) {
    test.fail("div was not returned")
  } else {
    test.deepEqual(
      div.getAttribute("x"),
      "50",
      "x was removed so svg:x is returned"
    )
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "50",
      "svg:x is set to 50"
    )

    test.deepEqual(
      applyDiff(tree, v5, v2).innerHTML,
      '<div x="50"></div>',
      "x attribute was set"
    )

    test.deepEqual(div.getAttribute("x"), "50", "x was set")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      null,
      "svg:x was removed"
    )

    const v6 = DOMinion.createHost(
      [],
      [
        DOMinion.createElement("div", [
          DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "8"),
          DOMinion.setAttribute("x", "5"),
          DOMinion.setAttributeNS(
            "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
            "x",
            "50"
          )
        ])
      ]
    )

    applyDiff(tree, v2, v6)

    test.deepEqual(div.getAttribute("x"), "5", "x was updated to 5")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "8",
      "svg:x was set to 8"
    )

    test.deepEqual(
      div.getAttributeNS(
        "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
        "x"
      ),
      "50",
      "xul:x was set to 50"
    )
  }
})
