/* @flow */

import type {
  Decode,
  Encode,
  Encoder,
  DecoderError,
  ChangeList,
  Result
} from "./Log"

export const patch = <target>(
  host: Encode<target>,
  changeList: ChangeList
): Result<target> => host(changeList)
