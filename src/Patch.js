/* @flow */

import type { Decoder, Encoder, DecoderError } from "./Log"
import mount from "./Patch/DOM"

export { mount }

export const patch = <target, buffer>(
  patcher: Encoder<target>,
  changeList: buffer,
  decoder: Decoder<buffer>
): Error | target => {
  const result = decoder.decode(changeList, patcher)
  if (result.isError === true) {
    return new Error(result.toString())
  } else {
    return result.encode()
  }
}
