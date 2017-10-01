/* @flow */

import type {
  Decode,
  Encode,
  Encoder,
  DecoderError,
  ChangeList,
  Result
} from "./Log"
import mount from "./Patch/DOM"

export { mount }

export const patch = <target>(
  host: Encode<target>,
  changeList: ChangeList
): Result<target> => host(changeList)
