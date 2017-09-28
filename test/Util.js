/* @flow */

import * as DOM from "../"
import * as FlatBuffer from "../lib/Log/FlatBuffer"
import { patcher } from "../lib/Patch/Log"
import { JSDOM } from "jsdom"

export const diff = <a>(
  left: DOM.Node<a>,
  right: DOM.Node<a>
): Array<string> => {
  const host = createHost("main")
  const encoder = FlatBuffer.encoder()

  const delta = DOM.diff(left, right, encoder)
  const buffer = encoder.encode()
  const decoder = FlatBuffer.decoder(buffer)
  const logger = patcher(host)
  DOM.patch(host, decoder, logger)
  return logger.log
}

export const createHost = (localName: string = "main"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)
