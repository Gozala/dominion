/* @flow */

import * as DOM from "../"
import * as FlatBuffer from "../lib/Log/FlatBuffer"
import Log from "../lib/Patch/Log"
import { JSDOM } from "jsdom"
import type { DecoderError } from "../lib/Log"

export const diff = <a>(
  left: DOM.Node<a>,
  right: DOM.Node<a>
): string[] | Object => {
  const delta = FlatBuffer.encode(DOM.diff(left, right))
  if (delta.isError === true) {
    return delta
  } else {
    return DOM.patch(Log, FlatBuffer.decode(delta))
  }
}

export const createHost = (localName: string = "main"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)
