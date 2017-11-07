/* @flow */

import type { Encoder, Decode, Result, ChangeList } from "../../Log"
import * as Log from "../../Log"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import type { Builder, ByteBuffer } from "flatbuffers"
import ChangeLog from "./ChangeLog.fbs"
import { DecoderError } from "./Error"

import {
  type Op,
  type OpVariant,
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
} from "./ChangeLog.fbs/Op"

export default class FlatBufferDecoder implements ChangeList {
  data: Uint8Array
  constructor(data: Uint8Array) {
    this.data = data
  }
  encode<buffer>(encoder: Encoder<buffer>, init: buffer): Result<buffer> {
    const byteBuffer = new flatbuffers.ByteBuffer(this.data)
    const chageLog = new ChangeLog()
    ChangeLog.getRootAsChangeLog(byteBuffer, chageLog)
    return ChangeLog.decode(chageLog, encoder, init)
  }

  static decode(data: Uint8Array): ChangeList {
    return new FlatBufferDecoder(data)
  }
}
