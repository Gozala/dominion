/* @flow */

import type { Encoder, Decoder, ChangeLog, ChangeList, Result } from "../../Log"
import type { Builder, ByteBuffer } from "flatbuffers"
import type { OpType, Op } from "./Op"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import { type change } from "./Change"
import { ok, error } from "result.flow"
import Change from "./Change"
import Changes from "./ChangeLog"

import {
  DecoderError,
  AssignBooleanProperty,
  AssignNullProperty,
  AssignNumberProperty,
  AssignStringProperty,
  DeleteProperty,
  DiscardStashed,
  EditTextData,
  InsertComment,
  InsertElement,
  InsertStashedNode,
  InsertText,
  RemoveAttribute,
  RemoveNextSibling,
  RemoveStyleRule,
  ReplaceWithComment,
  ReplaceWithElement,
  ReplaceWithStashedNode,
  ReplaceWithText,
  SelectChildren,
  SelectParent,
  SelectSibling,
  SetAttribute,
  SetStyleRule,
  SetTextData,
  StashNextSibling
} from "./Op"

const push = <a>(item: a, items: a[]): a[] => (items.push(item), items)

class Log {
  builder: Builder
  log: change[]
  constructor(builder: Builder, log: change[]) {
    this.reset(builder, log)
  }
  reset(builder: Builder, log: change[]): Log {
    this.builder = builder
    this.log = log

    return this
  }
  change(opType: OpType, opOffset: Op): Log {
    return this.reset(
      this.builder,
      push(Change.encode(this.builder, opType, opOffset), this.log)
    )
  }

  static selectChildren(state: Log): Log {
    return state.change(
      SelectChildren.opType,
      SelectChildren.encode(state.builder)
    )
  }
  static selectSibling(state: Log, offset: number): Log {
    return state.change(
      SelectSibling.opType,
      SelectSibling.encode(state.builder, offset)
    )
  }
  static selectParent(state: Log): Log {
    return state.change(SelectParent.opType, SelectParent.encode(state.builder))
  }
  static removeNextSibling(state: Log): Log {
    return state.change(
      RemoveNextSibling.opType,
      RemoveNextSibling.encode(state.builder)
    )
  }

  static insertText(state: Log, data: string): Log {
    return state.change(
      InsertText.opType,
      InsertText.encode(state.builder, data)
    )
  }
  static insertComment(state: Log, data: string): Log {
    return state.change(
      InsertComment.opType,
      InsertComment.encode(state.builder, data)
    )
  }
  static insertElement(state: Log, localName: string): Log {
    return state.change(
      InsertElement.opType,
      InsertElement.encode(state.builder, null, localName)
    )
  }
  static insertElementNS(
    state: Log,
    namespaceURI: string,
    localName: string
  ): Log {
    return state.change(
      InsertElement.opType,
      InsertElement.encode(state.builder, namespaceURI, localName)
    )
  }
  static insertStashedNode(state: Log, address: number): Log {
    return state.change(
      InsertStashedNode.opType,
      InsertStashedNode.encode(state.builder, address)
    )
  }

  static replaceWithText(state: Log, data: string): Log {
    return state.change(
      ReplaceWithText.opType,
      ReplaceWithText.encode(state.builder, data)
    )
  }
  static replaceWithComment(state: Log, data: string): Log {
    return state.change(
      ReplaceWithComment.opType,
      ReplaceWithComment.encode(state.builder, data)
    )
  }
  static replaceWithElement(state: Log, localName: string): Log {
    return state.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(state.builder, null, localName)
    )
  }
  static replaceWithElementNS(
    state: Log,
    namespaceURI: string,
    localName: string
  ): Log {
    return state.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(state.builder, namespaceURI, localName)
    )
  }
  static replaceWithStashedNode(state: Log, address: number): Log {
    return state.change(
      ReplaceWithStashedNode.opType,
      ReplaceWithStashedNode.encode(state.builder, address)
    )
  }

  static editTextData(
    state: Log,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Log {
    return state.change(
      EditTextData.opType,
      EditTextData.encode(state.builder, start, end, prefix, suffix)
    )
  }
  static setTextData(state: Log, data: string): Log {
    return state.change(
      SetTextData.opType,
      SetTextData.encode(state.builder, data)
    )
  }
  static setAttribute(state: Log, name: string, value: string): Log {
    return state.change(
      SetAttribute.opType,
      SetAttribute.encode(state.builder, null, name, value)
    )
  }
  static removeAttribute(state: Log, name: string): Log {
    return state.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(state.builder, null, name)
    )
  }
  static setAttributeNS(
    state: Log,
    namespaceURI: string,
    name: string,
    value: string
  ): Log {
    return state.change(
      SetAttribute.opType,
      SetAttribute.encode(state.builder, namespaceURI, name, value)
    )
  }
  static removeAttributeNS(
    state: Log,
    namespaceURI: string,
    name: string
  ): Log {
    return state.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(state.builder, namespaceURI, name)
    )
  }
  static assignProperty(
    state: Log,
    name: string,
    value: string | number | boolean | null
  ): Log {
    switch (typeof value) {
      case "string": {
        return state.change(
          AssignStringProperty.opType,
          AssignStringProperty.encode(state.builder, name, value)
        )
      }
      case "number": {
        return state.change(
          AssignNumberProperty.opType,
          AssignNumberProperty.encode(state.builder, name, value)
        )
      }
      case "boolean": {
        return state.change(
          AssignBooleanProperty.opType,
          AssignBooleanProperty.encode(state.builder, name, value)
        )
      }
      default: {
        if (value === null) {
          return state.change(
            AssignNullProperty.opType,
            AssignNullProperty.encode(state.builder, name, value)
          )
        } else {
          return unreachable(value)
        }
      }
    }
  }
  static deleteProperty(state: Log, name: string): Log {
    return state.change(
      DeleteProperty.opType,
      DeleteProperty.encode(state.builder, name)
    )
  }
  static setStyleRule(state: Log, name: string, value: string) {
    return state.change(
      SetStyleRule.opType,
      SetStyleRule.encode(state.builder, name, value)
    )
  }
  static removeStyleRule(state: Log, name: string) {
    return state.change(
      RemoveStyleRule.opType,
      RemoveStyleRule.encode(state.builder, name)
    )
  }

  static stashNextSibling(state: Log, address): Log {
    return state.change(
      StashNextSibling.opType,
      StashNextSibling.encode(state.builder, address)
    )
  }
  static discardStashedNode(state: Log, address: number): Log {
    return state.change(
      DiscardStashed.opType,
      DiscardStashed.encode(state.builder, address)
    )
  }
}

export const encode: Encoder<Uint8Array> = (
  changeList: ChangeList
): Result<Uint8Array> => {
  const builder = new flatbuffers.Builder(1024)
  const result = changeList.reduce(Log, new Log(builder, []))
  if (result instanceof Log) {
    const { builder, log } = result
    builder.finish(Changes.encode(builder, log))
    return builder.asUint8Array()
  } else {
    return result
  }
}
