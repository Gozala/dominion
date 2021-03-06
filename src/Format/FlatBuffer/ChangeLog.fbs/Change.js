/* @flow */

import type { Builder, Offset } from "flatbuffers"
import type { Encoder, Decode, Result } from "../../../Log"
import type { Op, OpType, OpVariant } from "./Op"
import { DecoderError } from "../Error"
import * as ChangeLogTable from "./ChangeLog"
import * as op from "./Op"

import {
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
  StashNextSibling,
  ShiftSiblings,
  AddEventListener,
  RemoveEventListener
} from "./Op"

export opaque type Encoded<type>: Offset = Offset
export type EncodedChange = Encoded<Change>

class UnknownOpType extends DecoderError {
  opType: OpType
  constructor(opType: OpType) {
    super()
    this.opType = opType
  }
  format(context?: string) {
    const where = context == null ? "" : `at ${context}`
    return `Encountered unknown opType:${this.opType.toString()} in "Change" table${where}`
  }
}

class OpError extends DecoderError {
  kind: "OpError" = "OpError"
  opName: string
  constructor(opName: string) {
    super()
    this.opName = opName
  }
  format(context?: string) {
    const where = context == null ? "" : `at ${context}`
    return `Failed to decode op as ${this.opName} table${where}`
  }
}

export default class Change extends ChangeLogTable.Change {
  static Table = ChangeLogTable.Change
  static pool: { [OpType]: OpVariant } = {
    [AssignStringProperty.opType]: new AssignStringProperty(),
    [RemoveNextSibling.opType]: new RemoveNextSibling(),
    [InsertText.opType]: new InsertText(),
    [InsertComment.opType]: new InsertComment(),
    [InsertElement.opType]: new InsertElement(),
    [ReplaceWithComment.opType]: new ReplaceWithComment(),
    [ReplaceWithText.opType]: new ReplaceWithText(),
    [ReplaceWithElement.opType]: new ReplaceWithElement(),
    [ReplaceWithStashedNode.opType]: new ReplaceWithStashedNode(),
    [InsertStashedNode.opType]: new InsertStashedNode(),
    [RemoveAttribute.opType]: new RemoveAttribute(),
    [DeleteProperty.opType]: new DeleteProperty(),
    [AssignBooleanProperty.opType]: new AssignBooleanProperty(),
    [AssignNullProperty.opType]: new AssignNullProperty(),
    [AssignNumberProperty.opType]: new AssignNumberProperty(),
    [SetAttribute.opType]: new SetAttribute(),
    [SetStyleRule.opType]: new SetStyleRule(),
    [RemoveStyleRule.opType]: new RemoveStyleRule(),
    [SelectChildren.opType]: new SelectChildren(),
    [SelectSibling.opType]: new SelectSibling(),
    [SelectParent.opType]: new SelectParent(),
    [EditTextData.opType]: new EditTextData(),
    [SetTextData.opType]: new SetTextData(),
    [DiscardStashed.opType]: new DiscardStashed(),
    [StashNextSibling.opType]: new StashNextSibling(),
    [ShiftSiblings.opType]: new ShiftSiblings(),
    [AddEventListener.opType]: new AddEventListener(),
    [RemoveEventListener.opType]: new RemoveEventListener()
  }
  static decode<x>(
    change: Change,
    changeLog: Encoder<x>,
    buffer: x
  ): x | DecoderError {
    const type = change.opType()
    const variant = Change.pool[type]
    if (variant == null) {
      return new UnknownOpType(type)
    } else {
      const op = change.op(variant)
      if (op == null) {
        return new OpError(variant.constructor.name)
      }
      return op.decode(changeLog, buffer)
    }
  }
  static encode(
    builder: Builder,
    opType: OpType,
    opOffset: Op
  ): Encoded<Change> {
    Change.startChange(builder)
    Change.addOp(builder, opOffset)
    Change.addOpType(builder, opType)
    return Change.endChange(builder)
  }
}
