/* @flow */

import type {
  Decode,
  Archive,
  Encoder,
  DecoderError,
  ChangeList,
  Result
} from "./Log"

export const patch = <a>(
  archive: Archive<a>,
  changeList: ChangeList
): Result<a> => archive.patch(changeList)
