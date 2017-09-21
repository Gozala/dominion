// @flow

import * as Dictionary from "dictionary.flow"
import type { Dict } from "dictionary.flow"
import * as DOMLog from "dom-log"
import * as JSONLog from "./src/Log/JSON"
import * as Flat from "./src/Log/FlatBuffer"

DOMLog //?

const host = DOMLog.createHost()

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

DOMLog.diff(host, tree1, JSONLog.encoder()) // ?JSON.stringify($.encode())
DOMLog.diff(tree1, tree1, JSONLog.encoder()) //?$.encode()
DOMLog.diff(tree1, tree2, JSONLog.encoder()) //?$.encode()

const fb1 = DOMLog.diff(host, tree1, Flat.encoder()) //?$.encode().length

const body = document.createElement("div") //?$.innerHTML

const ch1 = Flat.decoder(fb1.encode()) //?
DOMLog.patch(body, ch1) //?
body.innerHTML //?

const fb2 = DOMLog.diff(tree1, tree1, Flat.encoder()) //?$.encode().length
const ch2 = Flat.decoder(fb2.encode()) //?
DOMLog.patch(body, ch2) //?
body.innerHTML //?

const fb3 = DOMLog.diff(tree1, tree2, Flat.encoder()) //?$.encode().length
const ch3 = Flat.decoder(fb3.encode()) //?
DOMLog.patch(body, ch3) //?
body.innerHTML //?
