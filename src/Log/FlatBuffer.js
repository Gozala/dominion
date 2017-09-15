/* @flow */

import type { Log } from "../Log"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import type { Builder } from "flatbuffers"

import type { Change } from "./FlatBuffer/Change"
import {
  changeLog,
  change,
  selectSibling,
  selectParent,
  selectChildren,
  removeNextSibling,
  insertText,
  insertComment,
  insertElement,
  insertElementNS,
  insertStashedNode,
  replaceWithText,
  replaceWithComment,
  replaceWithElement,
  replaceWithElementNS,
  replaceWithStashedNode,
  editTextData,
  setTextData,
  setAttribute,
  removeAttribute,
  setAttributeNS,
  removeAttributeNS,
  assignStringProperty,
  assignNumberProperty,
  assignBooleanProperty,
  assignNullProperty,
  deleteProperty,
  setStyleRule,
  removeStyleRule,
  stashNextSibling,
  discardStashedNode
} from "./FlatBuffer/Change"

type Navigate = "SelectParent" | "SelectChildren" | number

const push = <a>(item: a, items: a[]): a[] => (items.push(item), items)

class Changes implements Log<Uint8Array> {
  address: number
  builder: Builder
  log: Array<Change>
  navigationLog: Array<Navigate>
  constructor(
    address: number,
    builder: Builder,
    log: Array<Change>,
    navigationLog: Array<Navigate>
  ) {
    this.reset(address, builder, log, navigationLog)
  }
  reset(
    address: number,
    builder: Builder,
    log: Array<Change>,
    navigationLog: Array<Navigate>
  ): self {
    this.address = address
    this.builder = builder
    this.log = log
    this.navigationLog = navigationLog

    return this
  }

  update(change: Change, address: number = this.address): self {
    const { navigationLog, builder } = this
    let { log } = this

    const count = navigationLog.length
    let index = 0
    let position = 0
    while (index < count) {
      const op = navigationLog[index++]
      switch (op) {
        case "SelectChildren": {
          if (position > 0) {
            log = push(selectSibling(builder, position), log)
            position = 0
          }
          log = push(selectChildren(builder), log)
          break
        }
        case "SelectParent": {
          log = push(selectParent(builder), log)
          break
        }
        default: {
          position += op
          break
        }
      }
    }

    if (position > 0) {
      log = push(selectSibling(builder, position), log)
    }

    return this.reset(this.address, builder, push(change, log), [])
  }
  navigate(op: Navigate): self {
    return this.reset(
      this.address,
      this.builder,
      this.log,
      push(op, this.navigationLog)
    )
  }

  selectChildren(): self {
    return this.navigate("SelectChildren")
  }
  selectSibling(offset: number): self {
    return this.navigate(offset)
  }
  selectParent(): self {
    return this.navigate("SelectParent")
  }
  removeNextSibling(): self {
    return this.update(removeNextSibling(this.builder))
  }

  insertText(data: string): self {
    return this.update(insertText(this.builder, data))
  }
  insertComment(data: string): self {
    return this.update(insertComment(this.builder, data))
  }
  insertElement(localName: string): self {
    return this.update(insertElement(this.builder, localName))
  }
  insertElementNS(namespaceURI: string, localName: string): self {
    return this.update(insertElementNS(this.builder, namespaceURI, localName))
  }
  insertStashedNode(address: number): self {
    return this.update(insertStashedNode(this.builder, address))
  }

  replaceWithText(data: string): self {
    return this.update(replaceWithText(this.builder, data))
  }
  replaceWithComment(data: string): self {
    return this.update(replaceWithComment(this.builder, data))
  }
  replaceWithElement(localName: string): self {
    return this.update(replaceWithElement(this.builder, localName))
  }
  replaceWithElementNS(namespaceURI: string, localName: string): self {
    return this.update(
      replaceWithElementNS(this.builder, namespaceURI, localName)
    )
  }
  replaceWithStashedNode(address: number): self {
    return this.update(replaceWithStashedNode(this.builder, address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): self {
    return this.update(editTextData(this.builder, start, end, prefix, suffix))
  }
  setTextData(data: string): self {
    return this.update(setTextData(this.builder, data))
  }
  setAttribute(name: string, value: string): self {
    return this.update(setAttribute(this.builder, name, value))
  }
  removeAttribute(name: string): self {
    return this.update(removeAttribute(this.builder, name))
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): self {
    return this.update(setAttributeNS(this.builder, namespaceURI, name, value))
  }
  removeAttributeNS(namespaceURI: string, name: string): self {
    return this.update(removeAttributeNS(this.builder, namespaceURI, name))
  }
  assignProperty(name: string, value: string | number | boolean | null): self {
    switch (typeof value) {
      case "string": {
        return this.update(assignStringProperty(this.builder, name, value))
      }
      case "number": {
        return this.update(assignNumberProperty(this.builder, name, value))
      }
      case "boolean": {
        return this.update(assignBooleanProperty(this.builder, name, value))
      }
      default: {
        if (value === null) {
          return this.update(assignNullProperty(this.builder, name, value))
        } else {
          return unreachable(value)
        }
      }
    }
  }
  deleteProperty(name: string): self {
    return this.update(deleteProperty(this.builder, name))
  }
  setStyleRule(name: string, value: string) {
    return this.update(setStyleRule(this.builder, name, value))
  }
  removeStyleRule(name: string) {
    return this.update(removeStyleRule(this.builder, name))
  }

  stashNextSibling(): self {
    return this.update(
      stashNextSibling(this.builder, this.address),
      this.address + 1
    )
  }
  discardStashedNode(address: number): self {
    return this.update(discardStashedNode(this.builder, address))
  }

  format(): Uint8Array {
    const { builder, log } = this
    builder.finish(changeLog(builder, log))
    return builder.asUint8Array()
  }
}

export const init = (): Log<Uint8Array> =>
  new Changes(0, new flatbuffers.Builder(1024), [], [])
