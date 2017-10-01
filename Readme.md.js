// @flow

import * as Dictionary from "dictionary.flow"
import type { Dict } from "dictionary.flow"
import * as DOMLog from "dom-log"
import JSON from "./src/Format/JSON"
import FlatBuffer from "./src/Format/FlatBuffer"

DOMLog //?

const tree0 = DOMLog.createHost()

const tree1 = DOMLog.createHost(
  [],
  [
    DOMLog.createElement(
      "div",
      [
        DOMLog.setAttribute("id", "main"),
        DOMLog.property("autofocus", true),
        DOMLog.style({
          backgroundColor: "red",
          color: "white"
        })
      ],
      [
        DOMLog.createTextNode("hi there"),
        DOMLog.createComment("this is some comment"),
        DOMLog.createElementNS("http://www.w3.org/2000/svg", "circle", [
          DOMLog.setAttribute("cx", "40"),
          DOMLog.setAttribute("cy", "50"),
          DOMLog.setAttribute("r", "26")
        ])
      ]
    )
  ]
) //?$.toDebugString()

const tree2 = DOMLog.createHost(
  [],
  [
    DOMLog.createElement(
      "div",
      [
        DOMLog.setAttribute("id", "main"),
        DOMLog.property("autofocus", true),
        DOMLog.style({
          backgroundColor: "blue",
          color: "white"
        })
      ],
      [
        DOMLog.createTextNode("hi there"),
        DOMLog.createComment("this is"),
        DOMLog.createElementNS("http://www.w3.org/2000/svg", "circle", [
          DOMLog.setAttribute("cx", "40"),
          DOMLog.setAttribute("cy", "50"),
          DOMLog.setAttribute("r", "26")
        ])
      ]
    )
  ]
) //?$.toDebugString()

DOMLog.diff(tree0, tree1) // ?JSON.stringify($.encode())
DOMLog.diff(tree1, tree1) //?$.encode()
DOMLog.diff(tree1, tree2) //?$.encode()

const json1 = JSON.encode(DOMLog.diff(tree0, tree1)) //?
const json2 = JSON.encode(DOMLog.diff(tree1, tree1)) //?
const json3 = JSON.encode(DOMLog.diff(tree1, tree2)) //?

const delta1 = FlatBuffer.encode(DOMLog.diff(tree0, tree1)) //?$.length

const body = document.createElement("div") //?$.innerHTML
const host = DOMLog.mount(body)

if (delta1.isError !== true) {
  DOMLog.patch(host, FlatBuffer.decode(delta1)) //?
  body.innerHTML //?
}

const delta2 = FlatBuffer.encode(DOMLog.diff(tree1, tree1)) //?$.encode().length

if (delta2.isError !== true) {
  DOMLog.patch(host, FlatBuffer.decode(delta2)) //?
  body.innerHTML //?
}

const delta3 = FlatBuffer.encode(DOMLog.diff(tree1, tree2)) //?$.encode().length
if (delta3.isError !== true) {
  DOMLog.patch(host, FlatBuffer.decode(delta3)) //?
}
body.innerHTML //?
