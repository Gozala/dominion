/* @flow */

import type { Decoder, Encoder, DecoderError } from "./Log"
import mount from "./Patch/DOM"

export { mount }

export const patch = <target, buffer>(
  host: Encoder<target>,
  changeList: buffer,
  decode: Decoder<buffer>
): Error | target => {
  const result = decode(changeList, host)
  if (result && result.isError === true) {
    return new Error(String(result))
  } else {
    return result
  }
}
