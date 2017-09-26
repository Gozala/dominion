/* @flow */

import type { Decoder, Log } from "./Log"
import { patcher } from "./Patch/dom"

export const patch = <buffer>(
  target: Node,
  changeList: Decoder,
  patcher: Log = patcher(target)
): void => {
  const result = changeList.decode(patcher)
  if (result.isError) {
    throw result
  }
}
