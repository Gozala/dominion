// @flow

import * as Dictionary from "dictionary.flow"
import type { Dict } from "dictionary.flow"
import * as DOMLog from "dom-log"
import * as JSONLog from "./src/Log/JSON"
import * as Flat from "./src/Log/FlatBuffer"

DOMLog //?

const tree1 = DOMLog.createElement(
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
) //?$.toDebugString()

const tree2 = DOMLog.createElement(
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
    DOMLog.createComment("this is"),
    DOMLog.createElementNS("http://www.w3.org/2000/svg", "circle", [
      DOMLog.setAttribute("cx", "40"),
      DOMLog.setAttribute("cy", "50"),
      DOMLog.setAttribute("r", "26")
    ])
  ]
) //?$.toDebugString()

DOMLog.diff(null, tree1, JSONLog.init()) // ?JSON.stringify($.format())
DOMLog.diff(tree1, tree1, JSONLog.init()) //?$.format()
DOMLog.diff(tree1, tree2, JSONLog.init()) //?$.format()

const fb1 = DOMLog.diff(null, tree1, Flat.init()) // ?$.format().length
const fb2 = DOMLog.diff(tree1, tree1, Flat.init()) //?$.format().length
const fb3 = DOMLog.diff(tree1, tree2, Flat.init()) //?$.format().length

const diff1 = [
  { kind: "InsertElement", namespaceURI: null, name: "div" },
  { kind: "SelectSibling", offset: 1 },
  { kind: "AssignProperty", name: "autofocus", value: true },
  { kind: "SetAttribute", name: "id", value: "main", namespaceURI: null },
  { kind: "SetStyleRule", name: "backgroundColor", value: "red" },
  { kind: "SetStyleRule", name: "color", value: "white" },
  { kind: "SetStyleRule", name: "settingType", value: 3 },
  { kind: "SelectChildren" },
  { kind: "InsertText", data: "hi there" },
  { kind: "SelectSibling", offset: 1 },
  { kind: "InsertComment", data: "this is some comment" },
  { kind: "SelectSibling", offset: 1 },
  {
    kind: "InsertElement",
    namespaceURI: "http://www.w3.org/2000/svg",
    name: "circle"
  },
  { kind: "SelectSibling", offset: 1 },
  { kind: "SetAttribute", name: "cx", value: "40", namespaceURI: null },
  { kind: "SetAttribute", name: "cy", value: "50", namespaceURI: null },
  { kind: "SetAttribute", name: "r", value: "26", namespaceURI: null }
]

const diff2 = []

import { flatbuffers } from "flatbuffers"
import {
  OpValue,
  AssignStringProperty,
  RemoveNextSibling,
  InsertText,
  InsertComment,
  InsertElement,
  ReplaceWithComment,
  ReplaceWithText,
  ReplaceWithElement,
  ReplaceWithStashedNode,
  InsertStashedNode,
  RemoveAttribute,
  DeleteProperty,
  AssignBooleanProperty,
  AssignNullProperty,
  AssignNumberProperty,
  SetAttribute,
  SetStyleRule,
  RemoveStyleRule,
  SelectChildren,
  SelectSibling,
  SelectParent,
  EditTextData,
  SetTextData,
  DiscardStashed,
  StashNextSibling,
  Change,
  ChangeLog
} from "./src/DOM/DOM.fbs.ts.js"

import { opType } from "./src/Log/FlatBuffer/Op"

const buffer = new flatbuffers.ByteBuffer(fb1.format())

opType //?

const changeLog = ChangeLog.getRootAsChangeLog(buffer) //?
changeLog.logLength() //?
let ch = changeLog.log(0) //?
ch && ch.opType() //?
let ie = ch && ch.op(new InsertElement()) //?
ie && ie.localName() //?
ie && ie.namespaceURI() //?

let ch2 = changeLog.log(1, ch || undefined) //?
ch2 && ch2.opType() //?
let ss = ch2 && ch2.op(new SelectSibling()) //?
ss && ss.offset() //?

let ch3 = changeLog.log(2, ch || undefined) //?
ch3 && ch3.opType() //?
let abp = ch3 && ch3.op(new AssignBooleanProperty()) //?
abp && abp.name() //?
abp && abp.value() //?
