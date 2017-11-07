/* @flow */

import * as DOMinon from "../"
import FlatBuffer from "../lib/Format/FlatBuffer"
import Log from "../lib/Patch/Log"
import { JSDOM } from "jsdom"

export const diff = <a>(
  left: DOMinon.Node<a>,
  right: DOMinon.Node<a>
): string[] | Object => {
  const delta = FlatBuffer.encode(DOMinon.diff(left, right))
  if (delta.isError === true) {
    return delta
  } else {
    return DOMinon.patch(Log.archive(), FlatBuffer.decode(delta))
  }
}

export const createHost = (localName: string = "x-host"): HTMLElement =>
  new JSDOM().window.document.createElement(localName)

export const createHostMount = (
  host: HTMLElement = createHost()
): DOMinon.Archive<HTMLElement> => DOMinon.mount(host)

export const applyDiff = <a>(
  host: DOMinon.Archive<HTMLElement>,
  left: DOMinon.Node<a>,
  right: DOMinon.Node<a>
): HTMLElement => {
  const result = DOMinon.patch(host, DOMinon.diff(left, right))
  if (result.isError === true) {
    throw result
  } else {
    return result
  }
}
