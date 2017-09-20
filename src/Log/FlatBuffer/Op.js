/* @flow */

import { flatbuffers } from "flatbuffers"
import type { Builder, Offset } from "flatbuffers"
import type { Log } from "../../Log"
import * as FBS from "../../DOM/DOM.fbs.ts.js"

export type OpType = FBS.Op
const opType = FBS.OpValue
export opaque type Op: Offset = Offset

export class DecoderError {
  +format: (context?: string) => string
  toString(): string {
    return this.format()
  }
  isError = true
}

class FieldError extends DecoderError {
  kind: "FieldError" = "FieldError"
  fieldName: string
  opName: string
  constructor(fieldName: string, opName: string) {
    super()
    this.opName = opName
    this.fieldName = fieldName
  }
  format(context?: string): string {
    const where = context == null ? "" : `at ${context}`
    return `Faild to decode a field "${this.fieldName}" from "${this
      .opName}" table${where}`
  }
}

export class AssignBooleanProperty extends FBS.AssignBooleanProperty {
  static opType = opType.AssignBooleanProperty
  opType: typeof opType.AssignBooleanProperty = opType.AssignBooleanProperty
  static encode(builder: Builder, name: string, value: boolean): Op {
    const nameOffset = builder.createString(name)
    AssignBooleanProperty.startAssignBooleanProperty(builder)
    AssignBooleanProperty.addName(builder, nameOffset)
    AssignBooleanProperty.addValue(builder, value)
    return AssignBooleanProperty.endAssignBooleanProperty(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "AssignBooleanProperty")
    } else {
      return decoder.assignProperty(name, this.value())
    }
  }
}

export class AssignNullProperty extends FBS.AssignNullProperty {
  static opType = opType.AssignNullProperty
  opType: typeof opType.AssignNullProperty = opType.AssignNullProperty
  static encode(builder: Builder, name: string, value: null = null): Op {
    const nameOffset = builder.createString(name)
    AssignNullProperty.startAssignNullProperty(builder)
    AssignNullProperty.addName(builder, nameOffset)
    return AssignNullProperty.endAssignNullProperty(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "AssignNullProperty")
    } else {
      return decoder.assignProperty(name, null)
    }
  }
}

export class AssignNumberProperty extends FBS.AssignNumberProperty {
  static opType = opType.AssignNumberProperty
  opType: typeof opType.AssignNumberProperty = opType.AssignNumberProperty
  static encode(builder: Builder, name: string, value: number): Op {
    const nameOffset = builder.createString(name)
    AssignNumberProperty.startAssignNumberProperty(builder)
    AssignNumberProperty.addName(builder, nameOffset)
    AssignNumberProperty.addValue(builder, value)
    return AssignNumberProperty.endAssignNumberProperty(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "AssignNumberProperty")
    } else {
      return decoder.assignProperty(name, this.value())
    }
  }
}

export class AssignStringProperty extends FBS.AssignStringProperty {
  static opType = opType.AssignStringProperty
  opType: typeof opType.AssignStringProperty = opType.AssignStringProperty
  static encode(builder: Builder, name: string, value: string): Op {
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)
    AssignStringProperty.startAssignStringProperty(builder)
    AssignStringProperty.addName(builder, nameOffset)
    AssignStringProperty.addValue(builder, valueOffset)
    return AssignStringProperty.endAssignStringProperty(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "AssignStringProperty")
    } else {
      return decoder.assignProperty(name, this.value())
    }
  }
}

export class DeleteProperty extends FBS.DeleteProperty {
  static opType = opType.DeleteProperty
  opType: typeof opType.DeleteProperty = opType.DeleteProperty
  static encode(builder: Builder, name: string): Op {
    const nameOffset = builder.createString(name)
    DeleteProperty.startDeleteProperty(builder)
    DeleteProperty.addName(builder, nameOffset)
    return DeleteProperty.endDeleteProperty(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "DeleteProperty")
    } else {
      return decoder.deleteProperty(name)
    }
  }
}

export class DiscardStashed extends FBS.DiscardStashed {
  static opType = opType.DiscardStashed
  opType: typeof opType.DiscardStashed = opType.DiscardStashed
  static encode(builder: Builder, address: number): Op {
    DiscardStashed.startDiscardStashed(builder)
    DiscardStashed.addAddress(builder, address)
    return DiscardStashed.endDiscardStashed(builder)
  }
  decode(decoder: Log): Log {
    return decoder.discardStashedNode(this.address())
  }
}

export class EditTextData extends FBS.EditTextData {
  static opType = opType.EditTextData
  opType: typeof opType.EditTextData = opType.EditTextData
  static encode(
    builder: Builder,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Op {
    const prefixOffset = builder.createString(prefix)
    const suffixOffset = builder.createString(suffix)
    EditTextData.startEditTextData(builder)
    EditTextData.addStart(builder, start)
    EditTextData.addEnd(builder, end)
    EditTextData.addPrefix(builder, prefixOffset)
    EditTextData.addSuffix(builder, suffixOffset)
    return EditTextData.endEditTextData(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const prefix = this.prefix()
    if (prefix == null) {
      return new FieldError("prefix", "EditTextData")
    }

    const suffix = this.suffix()
    if (suffix == null) {
      return new FieldError("suffix", "EditTextData")
    }

    return decoder.editTextData(this.start(), this.end(), prefix, suffix)
  }
}

export class InsertComment extends FBS.InsertComment {
  static opType = opType.InsertComment
  opType: typeof opType.InsertComment = opType.InsertComment
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    InsertComment.startInsertComment(builder)
    InsertComment.addData(builder, dataOffset)
    return InsertComment.endInsertComment(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", "InsertComment")
    } else {
      return decoder.insertComment(data)
    }
  }
}

export class InsertElement extends FBS.InsertElement {
  static opType = opType.InsertElement
  opType: typeof opType.InsertElement = opType.InsertElement
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    localName: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const localNameOffset = builder.createString(localName)
    InsertElement.startInsertElement(builder)
    if (namespaceURIOffset != null) {
      InsertElement.addNamespaceURI(builder, namespaceURIOffset)
    }
    InsertElement.addLocalName(builder, localNameOffset)
    return InsertElement.endInsertElement(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const localName = this.localName()
    if (localName == null) {
      return new FieldError("localName", "InsertElement")
    }

    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return decoder.insertElement(localName)
    } else {
      return decoder.insertElementNS(namespaceURI, localName)
    }
  }
}

export class InsertStashedNode extends FBS.InsertStashedNode {
  static opType = opType.InsertStashedNode
  opType: typeof opType.InsertStashedNode = opType.InsertStashedNode
  static encode(builder: Builder, address: number): Op {
    InsertStashedNode.startInsertStashedNode(builder)
    InsertStashedNode.addAddress(builder, address)
    return InsertStashedNode.endInsertStashedNode(builder)
  }
  decode(decoder: Log): Log {
    return decoder.insertStashedNode(this.address())
  }
}

export class InsertText extends FBS.InsertText {
  static opType = opType.InsertText
  opType: typeof opType.InsertText = opType.InsertText
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    InsertText.startInsertText(builder)
    InsertText.addData(builder, dataOffset)
    return InsertText.endInsertText(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", "InsertText")
    } else {
      return decoder.insertText(data)
    }
  }
}

export class RemoveAttribute extends FBS.RemoveAttribute {
  static opType = opType.RemoveAttribute
  opType: typeof opType.RemoveAttribute = opType.RemoveAttribute
  static encode(builder: Builder, namespaceURI: ?string, name: string): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const nameOffset = builder.createString(name)
    RemoveAttribute.startRemoveAttribute(builder)
    if (namespaceURIOffset != null) {
      RemoveAttribute.addNamespaceURI(builder, namespaceURIOffset)
    }
    RemoveAttribute.addName(builder, nameOffset)

    return RemoveAttribute.endRemoveAttribute(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "RemoveAttribute")
    }
    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return decoder.removeAttribute(name)
    } else {
      return decoder.removeAttributeNS(namespaceURI, name)
    }
  }
}

export class RemoveNextSibling extends FBS.RemoveNextSibling {
  static opType = opType.RemoveNextSibling
  opType: typeof opType.RemoveNextSibling = opType.RemoveNextSibling
  static encode(builder: Builder): Op {
    RemoveNextSibling.startRemoveNextSibling(builder)
    return RemoveNextSibling.endRemoveNextSibling(builder)
  }
  decode(decoder: Log): Log {
    return decoder.removeNextSibling()
  }
}

export class RemoveStyleRule extends FBS.RemoveStyleRule {
  static opType = opType.RemoveStyleRule
  opType: typeof opType.RemoveStyleRule = opType.RemoveStyleRule
  static encode(builder: Builder, name: string): Op {
    const nameOffset = builder.createString(name)
    RemoveStyleRule.startRemoveStyleRule(builder)
    RemoveStyleRule.addName(builder, nameOffset)
    return RemoveStyleRule.endRemoveStyleRule(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "RemoveStyleRule")
    } else {
      return decoder.removeStyleRule(name)
    }
  }
}

export class ReplaceWithComment extends FBS.ReplaceWithComment {
  static opType = opType.ReplaceWithComment
  opType: typeof opType.ReplaceWithComment = opType.ReplaceWithComment
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    ReplaceWithComment.startReplaceWithComment(builder)
    ReplaceWithComment.addData(builder, dataOffset)
    return ReplaceWithComment.endReplaceWithComment(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", "ReplaceWithComment")
    } else {
      return decoder.replaceWithComment(data)
    }
  }
}

export class ReplaceWithElement extends FBS.ReplaceWithElement {
  static opType = opType.ReplaceWithElement
  opType: typeof opType.ReplaceWithElement = opType.ReplaceWithElement
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    localName: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const localNameOffset = builder.createString(localName)
    ReplaceWithElement.startReplaceWithElement(builder)
    if (namespaceURIOffset != null) {
      ReplaceWithElement.addNamespaceURI(builder, namespaceURIOffset)
    }
    ReplaceWithElement.addLocalName(builder, localNameOffset)
    return ReplaceWithElement.endReplaceWithElement(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const localName = this.localName()
    if (localName == null) {
      return new FieldError("localName", "ReplaceWithElement")
    }

    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return decoder.replaceWithElement(localName)
    } else {
      return decoder.replaceWithElementNS(namespaceURI, localName)
    }
  }
}

export class ReplaceWithStashedNode extends FBS.ReplaceWithStashedNode {
  static opType = opType.ReplaceWithStashedNode
  opType: typeof opType.ReplaceWithStashedNode = opType.ReplaceWithStashedNode
  static encode(builder: Builder, address: number): Op {
    ReplaceWithStashedNode.startReplaceWithStashedNode(builder)
    ReplaceWithStashedNode.addAddress(builder, address)
    return ReplaceWithStashedNode.endReplaceWithStashedNode(builder)
  }
  decode(decoder: Log): Log {
    return decoder.replaceWithStashedNode(this.address())
  }
}

export class ReplaceWithText extends FBS.ReplaceWithText {
  static opType = opType.ReplaceWithText
  opType: typeof opType.ReplaceWithText = opType.ReplaceWithText
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    ReplaceWithText.startReplaceWithText(builder)
    ReplaceWithText.addData(builder, dataOffset)
    return ReplaceWithText.endReplaceWithText(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", "ReplaceWithText")
    } else {
      return decoder.replaceWithText(data)
    }
  }
}

export class SelectChildren extends FBS.SelectChildren {
  static opType = opType.SelectChildren
  opType: typeof opType.SelectChildren = opType.SelectChildren
  static encode(builder: Builder): Op {
    SelectChildren.startSelectChildren(builder)
    return SelectChildren.endSelectChildren(builder)
  }
  decode(decoder: Log): Log {
    return decoder.selectChildren()
  }
}

export class SelectParent extends FBS.SelectParent {
  static opType = opType.SelectParent
  opType: typeof opType.SelectParent = opType.SelectParent
  static encode(builder: Builder): Op {
    SelectParent.startSelectParent(builder)
    return SelectParent.endSelectParent(builder)
  }
  decode(decoder: Log): Log {
    return decoder.selectParent()
  }
}

export class SelectSibling extends FBS.SelectSibling {
  static opType = opType.SelectSibling
  opType: typeof opType.SelectSibling = opType.SelectSibling
  static encode(builder: Builder, n: number): Op {
    SelectSibling.startSelectSibling(builder)
    SelectSibling.addOffset(builder, n)
    return SelectSibling.endSelectSibling(builder)
  }
  decode(decoder: Log): Log {
    return decoder.selectSibling(this.offset())
  }
}

export class SetAttribute extends FBS.SetAttribute {
  static opType = opType.SetAttribute
  opType: typeof opType.SetAttribute = opType.SetAttribute
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    name: string,
    value: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)
    SetAttribute.startSetAttribute(builder)
    if (namespaceURIOffset != null) {
      SetAttribute.addNamespaceURI(builder, namespaceURIOffset)
    }
    SetAttribute.addName(builder, nameOffset)
    SetAttribute.addValue(builder, valueOffset)

    return SetAttribute.endSetAttribute(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", "SetAttribute")
    }
    const value = this.value()
    if (value == null) {
      return new FieldError("value", "SetAttribute")
    }
    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return decoder.setAttribute(name, value)
    } else {
      return decoder.setAttributeNS(namespaceURI, name, value)
    }
  }
}

export class SetStyleRule extends FBS.SetStyleRule {
  static opType = opType.SetStyleRule
  opType: typeof opType.SetStyleRule = opType.SetStyleRule
  static encode(builder: Builder, name: string, value: string): Op {
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)

    SetStyleRule.startSetStyleRule(builder)
    SetStyleRule.addName(builder, nameOffset)
    SetStyleRule.addValue(builder, valueOffset)

    return SetStyleRule.endSetStyleRule(builder)
  }
  decode(decoder: Log): Log | FieldError {
    console.log(`Decode: SetStyleRule`)

    const name = this.name()
    if (name == null) {
      return new FieldError("name", "SetStyleRule")
    }

    const value = this.value()
    if (value == null) {
      return new FieldError("value", "SetStyleRule")
    }

    return decoder.setStyleRule(name, value)
  }
}

export class SetTextData extends FBS.SetTextData {
  static opType = opType.SetTextData
  opType: typeof opType.SetTextData = opType.SetTextData
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    SetTextData.startSetTextData(builder)
    SetTextData.addData(builder, dataOffset)
    return SetTextData.endSetTextData(builder)
  }
  decode(decoder: Log): Log | FieldError {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", "SetTextData")
    } else {
      return decoder.setTextData(data)
    }
  }
}

export class StashNextSibling extends FBS.StashNextSibling {
  static opType = opType.StashNextSibling
  opType: typeof opType.StashNextSibling = opType.StashNextSibling
  static encode(builder: Builder, address: number): Op {
    StashNextSibling.startStashNextSibling(builder)
    StashNextSibling.addAddress(builder, address)
    return StashNextSibling.endStashNextSibling(builder)
  }
  decode(decoder: Log): Log | FieldError {
    return decoder.stashNextSibling(this.address())
  }
}

export type OpVariant =
  | AssignBooleanProperty
  | AssignNullProperty
  | AssignNumberProperty
  | AssignStringProperty
  | DeleteProperty
  | DiscardStashed
  | EditTextData
  | InsertComment
  | InsertElement
  | InsertStashedNode
  | InsertText
  | RemoveAttribute
  | RemoveNextSibling
  | RemoveStyleRule
  | ReplaceWithComment
  | ReplaceWithElement
  | ReplaceWithStashedNode
  | ReplaceWithText
  | SelectChildren
  | SelectParent
  | SelectSibling
  | SetAttribute
  | SetStyleRule
  | SetTextData
  | StashNextSibling
