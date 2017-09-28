/* @flow */

import type { Decoder, Encoder, DecoderError } from "./Log"
import { patcher } from "./Patch/DOM"

export const patch = (
  target: Node,
  changeList: Decoder,
  encoder: Encoder<Node> = patcher(target)
): Error | Node => {
  const result = changeList.decode(encoder)
  if (result.isError === true) {
    return new Error(result.toString())
  } else {
    return result.encode()
  }
}
