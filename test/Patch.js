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

test("removeAttribute", async test => {
  const tree = createHostMount()
  const _ = DOMinion.createHost()
  const div$ = DOMinion.createHost([], [DOMinion.createElement("div", [])])
  const div$x50 = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x", "50")])]
  )

  test.deepEqual(
    applyDiff(tree, _, div$).innerHTML,
    "<div></div>",
    "div is inserted"
  )

  test.deepEqual(
    applyDiff(tree, div$, div$x50).innerHTML,
    '<div x="50"></div>',
    'attribute x="50"'
  )

  test.deepEqual(
    applyDiff(tree, div$x50, div$).innerHTML,
    "<div></div>",
    "attribute was removed"
  )

  const div$x = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x")])]
  )

  test.deepEqual(
    applyDiff(tree, div$, div$x).innerHTML,
    '<div x=""></div>',
    "if attribute value is omitted it is empty string"
  )

  const div$xnull = DOMinion.createHost(
    [],
    [DOMinion.createElement("div", [DOMinion.setAttribute("x", null)])]
  )

  test.deepEqual(
    applyDiff(tree, div$x, div$xnull).innerHTML,
    "<div></div>",
    "if value null attribute is removed"
  )

  test.deepEqual(
    applyDiff(tree, div$xnull, div$x50).innerHTML,
    '<div x="50"></div>',
    "attribute is set"
  )

  test.deepEqual(
    applyDiff(tree, div$x50, div$x).innerHTML,
    '<div x=""></div>',
    'attribute value is set to "" if value is omitted'
  )
})

test("removeAttributeNS", async test => {
  const tree = createHostMount()
  const host = DOMinion.createHost()
  const _ = DOMinion.createHost([], [DOMinion.createElement("div", [])])
  const svgx50 = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "50")
      ])
    ]
  )
  const svgx = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x")
      ])
    ]
  )
  const svgxnull = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", null)
      ])
    ]
  )
  const svgx_ = DOMinion.createHost(
    [],
    [
      DOMinion.createElement("div", [
        DOMinion.setAttributeNS("http://www.w3.org/2000/svg", "x", "")
      ])
    ]
  )

  {
    const div = Object(applyDiff(tree, host, svgx50).firstElementChild)
    test.deepEqual(div.outerHTML, '<div x="50"></div>', "div was inserted")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "50",
      "svg:x=50 was set"
    )
  }

  {
    const div = Object(applyDiff(tree, svgx50, _).firstElementChild)
    test.deepEqual(div.outerHTML, "<div></div>", "attribute was removed")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      null,
      "svg:x was removed"
    )
    test.deepEqual(div.getAttribute("x"), null, "x attribute is removed")
  }

  {
    const div = Object(applyDiff(tree, _, svgx50).firstElementChild)
    test.deepEqual(div.outerHTML, '<div x="50"></div>', "div was inserted")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "50",
      "svg:x=50 was set"
    )
  }

  {
    const div = Object(applyDiff(tree, svgx50, svgx).firstElementChild)
    test.deepEqual(div.outerHTML, '<div x=""></div>', "x attribute is present")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "",
      `svg:x is ""`
    )
  }

  {
    const div = Object(applyDiff(tree, svgx, svgxnull).firstElementChild)
    test.deepEqual(div.outerHTML, "<div></div>", "attribute was removed")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      null,
      "svg:x was removed"
    )
    test.deepEqual(div.getAttribute("x"), null, "x attribute is removed")
  }

  {
    const div = Object(applyDiff(tree, svgx, svgx50).firstElementChild)
    test.deepEqual(div.outerHTML, '<div x="50"></div>', "x=50")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "50",
      "svg:x=50 was set"
    )
  }

  {
    const div = Object(applyDiff(tree, svgx50, svgxnull).firstElementChild)
    test.deepEqual(div.outerHTML, "<div></div>", "attribute was removed")
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      null,
      "svg:x was removed"
    )
    test.deepEqual(div.getAttribute("x"), null, "x attribute is removed")
  }

  {
    const div = Object(applyDiff(tree, svgxnull, svgx_).firstElementChild)
    test.deepEqual(div.outerHTML, '<div x=""></div>', "x attribute is present")
    test.deepEqual(div.getAttribute("x"), "", `x=""`)
    test.deepEqual(
      div.getAttributeNS("http://www.w3.org/2000/svg", "x"),
      "",
      `svg:x=""`
    )
  }
})

test("assignProperty", async test => {
  const tree = createHostMount()
  const host = DOMinion.createHost()
  const _ = DOMinion.createHost([], [DOMinion.createElement("div")])
  const x = value =>
    DOMinion.createHost(
      [],
      [DOMinion.createElement("div", [DOMinion.property("x", value)])]
    )

  const isHidden = value =>
    DOMinion.createHost(
      [],
      [DOMinion.createElement("div", [DOMinion.property("isHidden", value)])]
    )

  const value = value =>
    DOMinion.createHost(
      [],
      [DOMinion.createElement("div", [DOMinion.property("value", value)])]
    )

  const div: Object = Object(applyDiff(tree, host, _).firstElementChild)

  applyDiff(tree, _, x(50))
  test.equal(div.x, 50, "x was set to 50")

  applyDiff(tree, x(50), x(51))
  test.equal(div.x, 51, "x was updated to 51")

  applyDiff(tree, x(51), _)
  test.equal("x" in div, false, "x was removed")

  applyDiff(tree, _, isHidden(true))
  test.equal(div.isHidden, true, "isHidden was set to true")

  applyDiff(tree, isHidden(true), isHidden(false))
  test.equal(div.isHidden, false, "isHidden was updated to false")

  applyDiff(tree, isHidden(false), isHidden(true))
  test.equal(div.isHidden, true, "isHidden was updated to true")

  applyDiff(tree, isHidden(true), isHidden(null))
  test.equal(div.isHidden, null, "isHidden was updated to null")

  applyDiff(tree, isHidden(null), isHidden("Yes"))
  test.equal(div.isHidden, "Yes", 'isHidden was updated to "Yes"')

  applyDiff(tree, isHidden("Yes"), _)
  test.equal("isHidden" in div, false, "isHidden was removed")

  applyDiff(tree, _, value("cat"))
  test.equal(div.value, "cat", 'expando value was set to "cat"')

  applyDiff(tree, value("cat"), value("cat"))
  test.equal(div.value, "cat", 'expando value is still "cat"')

  applyDiff(tree, value("cat"), value("dog"))
  test.equal(div.value, "dog", 'expando value changed to "dog"')

  applyDiff(tree, value("dog"), value(""))
  test.equal(div.value, "", 'expando value changed to ""')

  applyDiff(tree, value("dog"), value(null))
  test.ok(div.value === null, "expando value changed to null")

  applyDiff(tree, value(null), value(undefined))
  test.ok(div.value === undefined, "expando value changed to undefined")
  test.equal("value" in div, false, "expando value was removed")
})

test("deleteProperty", async test => {
  const tree = createHostMount()
  const host = DOMinion.createHost()
  const property = name => (...args) =>
    DOMinion.createHost(
      [],
      [
        DOMinion.createElement("div", [
          args.length === 0
            ? DOMinion.property(name)
            : DOMinion.property(name, args[0])
        ])
      ]
    )

  const _ = DOMinion.createHost([], [DOMinion.createElement("div")])
  const x = property("x")
  const isHidden = property("isHidden")
  const value = property("value")

  const div: Object = Object(applyDiff(tree, host, _).firstElementChild)
  applyDiff(tree, _, x(50))

  test.equal(div.x, 50, "x was set to 50")

  applyDiff(tree, x(50), _)
  test.ok(div.x === undefined, "x expando is undefined")
  test.equal("x" in div, false, "x expando was removed")

  applyDiff(tree, _, value("what"))
  test.equal(div.value, "what", 'value expand set to "what"')

  applyDiff(tree, value("what"), value())
  test.equal(div.value === undefined, true, "value expando is undefined")
  test.equal("value" in div, false, "vale expand was removed")

  applyDiff(tree, _, value(true))
  test.equal(div.value, true, "value expand set to true")

  applyDiff(tree, value(true), value(undefined))
  test.equal(div.value === undefined, true, "value expando is undefined")
  test.equal("value" in div, false, "value expand was removed")

  applyDiff(tree, value(undefined), value(null))
  test.equal(div.value === null, true, "value expando is null")

  applyDiff(tree, value(null), value(undefined))
  test.equal(div.value === undefined, true, "value expando is undefined")
  test.equal("value" in div, false, "value expand was removed")

  applyDiff(tree, value(undefined), value(null))
  test.equal(div.value === null, true, "value expando is null")

  applyDiff(tree, value(null), value())
  test.equal(div.value === undefined, true, "value expando is undefined")
  test.equal("value" in div, false, "value expand was removed")
})

test("setStyleRule", async test => {
  const tree = createHostMount()

  const styled = (...rules) =>
    DOMinion.createHost(
      [],
      [DOMinion.createElement("div", rules.map(rule => DOMinion.style(rule)))]
    )

  const assert = cases =>
    cases.reduce((last, [next, style]) => {
      test.deepEqual(
        applyDiff(tree, last, next).innerHTML,
        `<div style="${style}"></div>`,
        `expect style ${style}`
      )
      return next
    }, DOMinion.createHost())

  assert([
    [
      styled({
        backgroundColor: "red",
        position: null
      }),
      "background-color: red;"
    ],
    [
      styled({
        display: "block"
      }),
      "display: block;"
    ],
    [
      styled({
        backgroundColor: "red",
        display: null
      }),
      "background-color: red;"
    ],
    [
      styled({
        color: "white",
        backgroundColor: "red"
      }),
      "background-color: red; color: white;"
    ],
    [
      styled({
        backgroundColor: "blue"
      }),
      "background-color: blue;"
    ],
    [
      styled(
        {
          color: "white",
          backgroundColor: "red"
        },
        {
          backgroundColor: "green"
        }
      ),
      "background-color: green; color: white;"
    ],
    [styled(), ""]
  ])
})

test("nested children", async test => {
  const tree = createHostMount()
  const html = (...chunks) => node => {
    const html = chunks.join("")
    test.deepEqual(node.innerHTML, html, html)
  }

  const assert = cases =>
    cases.reduce((last, [next, test]) => {
      test(applyDiff(tree, last, next))
      return next
    }, DOMinion.createHost())

  assert([
    [
      DOMinion.createHost(
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
      ),
      html(
        '<div id="main" style="background-color: blue; color: white;">',
        "hi there",
        "<!--this is-->",
        '<circle cx="40" cy="50" r="26">',
        "<span>",
        "what's up ?",
        "</span>",
        "</circle>",
        "</div>"
      )
    ],
    [
      DOMinion.createHost(
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
      ),
      html(
        '<div id="main" style="background-color: blue; color: white;">',
        "hi there",
        "<!--this is-->",
        '<circle cx="40" cy="50" r="26">',
        "<span>",
        "bye",
        "</span>",
        "</circle>",
        "</div>"
      )
    ],
    [
      DOMinion.createHost(
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
      ),
      html(
        '<div id="main" style="background-color: blue; color: white;">',
        "hi there",
        "</div>"
      )
    ],
    [
      DOMinion.createHost(
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
      ),
      html(
        '<div id="main" style="background-color: blue; color: white;">',
        '<h1 class="title">',
        "Example",
        "</h1>",
        "<p></p>",
        "</div>"
      )
    ],
    [
      DOMinion.createHost(
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
      ),
      html(
        '<div id="main" style="background-color: blue; color: white;">',
        "<h1>",
        "Example",
        "</h1>",
        "<p>Hi</p>",
        "</div>"
      )
    ]
  ])
})

test("indexed element ordering", async test => {
  const tree = createHostMount()

  const toHTML = items =>
    `<ul>${items.map(item => `<li id="${item}"></li>`).join("")}</ul>`

  const toDOM = items =>
    items == null
      ? DOMinion.createHost()
      : DOMinion.createHost(
          [],
          [
            DOMinion.createIndexedElement(
              "ul",
              [],
              items.map(item => [
                item,
                DOMinion.createElement("li", [
                  DOMinion.setAttribute("id", item)
                ])
              ])
            )
          ]
        )

  const assert = cases =>
    cases.reduce((last, next) => {
      test.equal(
        applyDiff(tree, toDOM(last), toDOM(next)).innerHTML,
        toHTML(next),
        `${String(last)} -> ${String(next)}`
      )
      return next
    }, null)

  const combinations = (items: Array<string>) => {
    return items.reduce((all, item) => {
      const index = items.indexOf(item)
      const rest = [...items.slice(0, index), ...items.slice(index + 1)]
      let n = 0
      while (n <= rest.length) {
        all.push([...rest.slice(0, n), item, ...rest.slice(n)])
        n++
      }
      return all
    }, [])
  }

  assert(combinations(["a", "b", "c"]))
})

test("indexed element random insert", async test => {
  const tree = createHostMount()

  const toHTML = items =>
    `<ul>${items.map(item => `<li id="${item}"></li>`).join("")}</ul>`

  const toDOM = items =>
    items == null
      ? DOMinion.createHost()
      : DOMinion.createHost(
          [],
          [
            DOMinion.createIndexedElement(
              "ul",
              [],
              items.map(item => [
                item,
                DOMinion.createElement("li", [
                  DOMinion.setAttribute("id", item)
                ])
              ])
            )
          ]
        )

  const assert = cases =>
    cases.reduce((last, next) => {
      test.equal(
        applyDiff(tree, toDOM(last), toDOM(next)).innerHTML,
        toHTML(next),
        `${String(last)} -> ${String(next)}`
      )
      return next
    }, null)

  const combinations = (source: Array<string>, inserts: Array<string>) => {
    let all = [source]
    for (const insert of inserts) {
      const limit = all.length
      let index = 0
      while (index < limit) {
        const items = all[index]
        const count = items.length
        let n = 0
        while (n <= count) {
          all.push([...items.slice(0, n), insert, ...items.slice(n)])
          all.push(source)
          n++
        }
        index++
      }
    }
    return all
  }

  assert(combinations(["a", "b", "c"], ["X", "Y"]))
})

test("indexed element random delete", async test => {
  const tree = createHostMount()

  const toHTML = items =>
    `<ul>${items.map(item => `<li id="${item}"></li>`).join("")}</ul>`

  const toDOM = items =>
    items == null
      ? DOMinion.createHost()
      : DOMinion.createHost(
          [],
          [
            DOMinion.createIndexedElement(
              "ul",
              [],
              items.map(item => [
                item,
                DOMinion.createElement("li", [
                  DOMinion.setAttribute("id", item)
                ])
              ])
            )
          ]
        )

  const assert = cases =>
    cases.reduce((last, next) => {
      test.equal(
        applyDiff(tree, toDOM(last), toDOM(next)).innerHTML,
        toHTML(next),
        `${String(last)} -> ${String(next)}`
      )
      return next
    }, null)

  const combinations = (source: Array<string>) => {
    let all = [source]
    for (const item of source) {
      const limit = all.length
      let index = 0
      while (index < limit) {
        const items = all[index]
        const n = items.indexOf(item)
        all.push([...items.slice(0, n), ...items.slice(n + 1)])
        all.push(source)
        index++
      }
    }
    return all
  }

  assert(combinations(["a", "b", "c", "d"]))
})

test("indexed element insert/remove/reorder", async test => {
  const tree = createHostMount()

  const toHTML = items =>
    `<ul>${items.map(item => `<li id="${item}"></li>`).join("")}</ul>`

  const toDOM = items =>
    items == null
      ? DOMinion.createHost()
      : DOMinion.createHost(
          [],
          [
            DOMinion.createIndexedElement(
              "ul",
              [],
              items.map(item => [
                item,
                DOMinion.createElement("li", [
                  DOMinion.setAttribute("id", item)
                ])
              ])
            )
          ]
        )

  const assert = cases =>
    cases.reduce((last, next) => {
      test.equal(
        applyDiff(tree, toDOM(last), toDOM(next)).innerHTML,
        toHTML(next),
        `${String(last)} -> ${String(next)}`
      )
      return next
    }, null)

  const combinations = (source: Array<string>) => {
    let all = [[]]
    for (const item of source) {
      const limit = all.length
      let index = 0
      while (index < limit) {
        const items = all[index]
        const count = items.length
        let n = 0
        while (n <= count) {
          all.push([...items.slice(0, n), item, ...items.slice(n)])
          n++
        }
        index++
      }
    }

    const combos = []
    for (let from of all) {
      for (let to of all) {
        combos.push(from)
        combos.push(to)
      }
    }

    return combos
  }

  assert(combinations(["a", "b", "c"]))
})
