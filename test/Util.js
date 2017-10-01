/* @flow */

import * as DOM from "../"
import FlatBuffer from "../lib/Format/FlatBuffer"
import Log from "../lib/Patch/Log"
import { JSDOM } from "jsdom"

export const diff = <a>(
  left: DOM.Node<a>,
  right: DOM.Node<a>
): string[] | Object => {
  const delta = FlatBuffer.encode(DOM.diff(left, right))
  if (delta.isError === true) {
    return delta
  } else {
    return DOM.patch(Log.encode, FlatBuffer.decode(delta))
  }
}

export const createHost = (localName: string = "main"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)
