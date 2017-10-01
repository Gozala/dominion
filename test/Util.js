/* @flow */

import * as DOM from "../"
import * as FlatBuffer from "../lib/Log/FlatBuffer"
import Log from "../lib/Patch/Log"
import { JSDOM } from "jsdom"
import type { DecoderError } from "../lib/Log"

export const diff = <a>(
  left: DOM.Node<a>,
  right: DOM.Node<a>
): string[] | DecoderError => {
  const delta = FlatBuffer.encode(DOM.diff(left, right))
  if (delta.isOk) {
    const result = DOM.patch(Log, FlatBuffer.decode(delta.value))
    if (result.isOk) {
      return result.value
    } else {
      return result.error
    }
  } else {
    return delta.error
  }
}

export const createHost = (localName: string = "main"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)
