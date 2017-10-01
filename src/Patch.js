/* @flow */

import type { Decoder, Encoder, DecoderError, ChangeList } from "./Log"
import mount from "./Patch/DOM"

export { mount }

export const patch = <target>(
  host: Encoder<target>,
  changeList: ChangeList
): Error | target => {
  const result = host(changeList)
  if (result && result.isError === true) {
    return new Error(String(result))
  } else {
    return result
  }
}
