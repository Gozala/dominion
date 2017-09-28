/* @flow */

import type { Decoder, Encoder } from "../../Log"
import type { Op, OpType, OpVariant } from "./Op"
import type { Builder, Offset } from "flatbuffers"
import type { change } from "./Change"
import * as FBS from "../../DOM/DOM.fbs.ts.js"
import { Change } from "./Change"
import { DecoderError } from "./Op"

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

export class ChangeLog extends FBS.ChangeLog implements Decoder {
  change = new Change()
  decode<x>(encoder: Encoder<x>): Encoder<x> | DecoderError {
    const count = this.logLength()
    console.log(`Decode: ChangeLog contains ${count} changes`)

    let index = 0
    while (index < count) {
      console.log(`Decode: log[${index}]`)
      const change = this.log(index, this.change)
      if (change == null) {
        console.error(`Decode: Change is null log[${index}]`)
        return new IndexError(index)
      }
      const result = this.change.decode(encoder)
      if (result instanceof DecoderError) {
        return new ChangeError(index, result)
      } else {
        encoder = result
      }
      index++
    }

    return encoder
  }
  static encode(builder: Builder, changes: change[]): Offset {
    const logOffset = ChangeLog.createLogVector(builder, (changes: any))
    ChangeLog.startChangeLog(builder)
    if (logOffset != null) {
      ChangeLog.addLog(builder, logOffset)
    }
    return ChangeLog.endChangeLog(builder)
  }
}
