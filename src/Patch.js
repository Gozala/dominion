/* @flow */

import type { Decoder, Encoder, DecoderError, ChangeList, Result } from "./Log"
import mount from "./Patch/DOM"

export { mount }

export const patch = <target>(
  host: Encoder<target>,
  changeList: ChangeList
): Result<target> => host(changeList)
