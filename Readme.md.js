// @flow

import * as Dictionary from "dictionary.flow"
import type { Dict } from "dictionary.flow"
import * as DOMinion from "dominion"
import JSON from "./src/Format/JSON"
import FlatBuffer from "./src/Format/FlatBuffer"

DOMinion //?

const tree0 = DOMinion.createHost()

const tree1 = DOMinion.createHost(
  [],
  [
    DOMinion.createElement(
      "div",
      [
        DOMinion.setAttribute("id", "main"),
        DOMinion.property("autofocus", true),
        DOMinion.style({
          backgroundColor: "red",
          color: "white"
        })
      ],
      [
        DOMinion.createTextNode("hi there"),
        DOMinion.createComment("this is some comment"),
        DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle", [
          DOMinion.setAttribute("cx", "40"),
          DOMinion.setAttribute("cy", "50"),
          DOMinion.setAttribute("r", "26")
        ])
      ]
    )
  ]
) //?$.toDebugString()

const tree2 = DOMinion.createHost(
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
        DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle", [
          DOMinion.setAttribute("cx", "40"),
          DOMinion.setAttribute("cy", "50"),
          DOMinion.setAttribute("r", "26")
        ])
      ]
    )
  ]
) //?$.toDebugString()

DOMinion.diff(tree0, tree1) // ?JSON.stringify($.encode())
DOMinion.diff(tree1, tree1) //?$.encode()
DOMinion.diff(tree1, tree2) //?$.encode()

const json1 = JSON.encode(DOMinion.diff(tree0, tree1)) //?
const json2 = JSON.encode(DOMinion.diff(tree1, tree1)) //?
const json3 = JSON.encode(DOMinion.diff(tree1, tree2)) //?

const delta1 = FlatBuffer.encode(DOMinion.diff(tree0, tree1)) //?$.length

const body = document.createElement("div") //?$.innerHTML
const host = DOMinion.mount(body)

if (delta1.isError !== true) {
  DOMinion.patch(host, FlatBuffer.decode(delta1)) //?
  body.innerHTML //?
}

const delta2 = FlatBuffer.encode(DOMinion.diff(tree1, tree1)) //?$.encode().length

if (delta2.isError !== true) {
  DOMinion.patch(host, FlatBuffer.decode(delta2)) //?
  body.innerHTML //?
}

const delta3 = FlatBuffer.encode(DOMinion.diff(tree1, tree2)) //?$.encode().length
if (delta3.isError !== true) {
  DOMinion.patch(host, FlatBuffer.decode(delta3)) //?
}
body.innerHTML //?
