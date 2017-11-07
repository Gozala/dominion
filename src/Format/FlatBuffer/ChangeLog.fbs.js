/* @flow */

import type { Encoder } from "../../Log"
import * as Log from "../../Log"
import type { Op, OpType, OpVariant } from "./ChangeLog.fbs/Op"
import type { Builder, Offset } from "flatbuffers"
import type { EncodedChange } from "./ChangeLog.fbs/Change"
import * as ChangeLogTable from "./ChangeLog.fbs/ChangeLog"
import Change from "./ChangeLog.fbs/Change"
import { DecoderError } from "./Error"

class IndexError extends DecoderError {
  kind: "IndexError" = "IndexError"
  index: number
  constructor(index: number) {
    super()
    this.index = index
  }
  fromat(context: ?string): string {
    const where = context == null ? "" : `at ${context}`
    return `Failed to decode ${this.index}th element from a vector${where}`
  }
}

class ChangeError extends DecoderError {
  index: number
  reason: DecoderError
  constructor(index: number, reason: DecoderError) {
    super()
    this.index = index
    this.reason = reason
  }
  fromat(context: ?string): string {
    const { index, reason } = this
    return reason.format(`changeLog.log[${index}]`)
  }
}

const changePool = new Change()

export default class ChangeLog extends ChangeLogTable.ChangeLog {
  static Table = ChangeLogTable.ChangeLog
  static decode<x>(
    table: ChangeLog,
    changeLog: Encoder<x>,
    buffer: x
  ): Log.Result<x> {
    const count = table.logLength()

    let index = 0
    while (index < count) {
      const change = table.log(index, changePool)
      if (change == null) {
        console.error(`Decode: Change is null log[${index}]`)
        return new IndexError(index)
      }
      const result = Change.decode(changePool, changeLog, buffer)
      if (result instanceof DecoderError) {
        return new ChangeError(index, result)
      } else {
        buffer = result
      }
      index++
    }

    return buffer
  }
  static encode(builder: Builder, changes: EncodedChange[]): Offset {
    const logOffset = ChangeLog.createLogVector(builder, (changes: any))
    ChangeLog.startChangeLog(builder)
    ChangeLog.addLog(builder, logOffset)
    return ChangeLog.endChangeLog(builder)
  }
}
