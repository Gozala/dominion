/* @flow */

import type { Decode, Encode, Encoder, ChangeList } from "../../Log"
import * as Log from "../../Log"
import type { Op, OpType, OpVariant } from "./Op"
import type { Builder, Offset } from "flatbuffers"
import type { change } from "./Change"
import { ChangeLog } from "../../DOM/DOM.fbs.ts.js"
import Change from "./Change"
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

// export class ChangeLog extends FBS.ChangeLog {
//   change = new Change()
//   static decode<x>(
//     changeLog: ChangeLog,
//     encoder: Encoder<x>
//   ): Encoder<x> | DecoderError {
//     const count = changeLog.logLength()
//     console.log(`Decode: ChangeLog contains ${count} changes`)

//     let index = 0
//     while (index < count) {
//       console.log(`Decode: log[${index}]`)
//       const change = changeLog.log(index, changeLog.change)
//       if (change == null) {
//         console.error(`Decode: Change is null log[${index}]`)
//         return new IndexError(index)
//       }
//       const result = changeLog.change.decode(encoder)
//       if (result instanceof DecoderError) {
//         return new ChangeError(index, result)
//       } else {
//         encoder = result
//       }
//       index++
//     }

//     return encoder
//   }
//   static encode(builder: Builder, changes: change[]): Offset {
//     const logOffset = ChangeLog.createLogVector(builder, (changes: any))
//     ChangeLog.startChangeLog(builder)
//     if (logOffset != null) {
//       ChangeLog.addLog(builder, logOffset)
//     }
//     return ChangeLog.endChangeLog(builder)
//   }
// }

const changePool = new Change.Table()

class Codec {
  Table = ChangeLog
  decode<x>(table: ChangeLog, changeLog: Encoder<x>, buffer: x): Log.Result<x> {
    const count = table.logLength()
    console.log(`Decode: ChangeLog contains ${count} changes`)

    let index = 0
    while (index < count) {
      console.log(`Decode: log[${index}]`)
      const change = table.log(index, changePool)
      if (change == null) {
        console.error(`Decode: Change is null log[${index}]`)
        return new IndexError(index)
      }
      const result = Change.decode(change, changeLog, buffer)
      if (result instanceof DecoderError) {
        return new ChangeError(index, result)
      } else {
        buffer = result
      }
      index++
    }

    return buffer
  }
  encode(builder: Builder, changes: change[]): Offset {
    const logOffset = ChangeLog.createLogVector(builder, (changes: any))
    ChangeLog.startChangeLog(builder)
    if (logOffset != null) {
      ChangeLog.addLog(builder, logOffset)
    }
    return ChangeLog.endChangeLog(builder)
  }
}

export default new Codec()
