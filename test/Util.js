/* @flow */

import * as DOM from "../"
import * as FlatBuffer from "../lib/Log/FlatBuffer"
import Log from "../lib/Patch/Log"
import { JSDOM } from "jsdom"

export const diff = <a>(
  left: DOM.Node<a>,
  right: DOM.Node<a>
): Error | string[] => {
  const delta = DOM.diff(left, right, FlatBuffer.encoder)
  return DOM.patch(Log, delta, FlatBuffer.decoder)
}

export const createHost = (localName: string = "main"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)
