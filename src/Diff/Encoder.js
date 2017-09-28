/* @flow */

import type { Encoder, Decoder } from "../Log"

type Nav = [-1 | 0 | 1, number]

class Diff<buffer> implements Encoder<buffer> {
  encoder: Encoder<buffer>
  navigationLog: Nav[]
  address: number
  constructor(encoder: Encoder<buffer>, address: number, navigationLog: Nav[]) {
    this.reset(encoder, address, navigationLog)
  }
  reset(
    encoder: Encoder<buffer>,
    address: number,
    navigationLog: Nav[]
  ): Diff<buffer> {
    this.encoder = encoder
    this.address = address
    this.navigationLog = navigationLog
    return this
  }
  updateAddress(address: number): Diff<buffer> {
    return this.reset(this.encoder, address, this.navigationLog)
  }
  updateNavigationLog(navigationLog: Nav[]): Diff<buffer> {
    return this.reset(this.encoder, this.address, navigationLog)
  }

  update(encoder: Encoder<buffer>): Diff<buffer> {
    return this.reset(encoder, this.address, this.navigationLog)
  }
  navigate(): Diff<buffer> {
    const { navigationLog, encoder } = this

    while (navigationLog.length > 0) {
      let [level, index] = navigationLog.pop()

      if (level < 0) {
        this.encoder = encoder.selectParent()
      }

      if (level > 0) {
        this.encoder = encoder.selectChildren()
      }

      if (index !== 0) {
        this.encoder = encoder.selectSibling(index)
      }
    }

    return this
  }

  selectChildren(): Diff<buffer> {
    const { navigationLog, encoder } = this
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog[0]
    switch (level) {
      case -1: {
        if (index === 0) {
          navigationLog.shift()
        }
        navigationLog.unshift([1, 0])
        break
      }
      case 0: {
        navigationLog.unshift([1, 0])
        break
      }
      default: {
        navigationLog.unshift([1, 0])
        break
      }
    }
    return this.updateNavigationLog(navigationLog)
  }
  selectSibling(offset: number): Diff<buffer> {
    const { navigationLog, encoder } = this
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog.shift()
    navigationLog.unshift([level, index + offset])

    return this.updateNavigationLog(navigationLog)
  }
  selectParent(): Diff<buffer> {
    const { navigationLog } = this
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog[0]
    switch (level) {
      case -1: {
        navigationLog.unshift([-1, 0])
        break
      }
      case 0: {
        navigationLog.shift()
        break
      }
      default: {
        navigationLog.shift()
        break
      }
    }

    return this.updateNavigationLog(navigationLog)
  }
  removeNextSibling(): Diff<buffer> {
    return this.update(this.navigate().encoder.removeNextSibling())
  }

  insertText(data: string): Diff<buffer> {
    return this.update(this.navigate().encoder.insertText(data))
  }
  insertComment(data: string): Diff<buffer> {
    return this.update(this.navigate().encoder.insertComment(data))
  }
  insertElement(localName: string): Diff<buffer> {
    return this.update(this.navigate().encoder.insertElement(localName))
  }
  insertElementNS(namespaceURI: string, localName: string): Diff<buffer> {
    return this.update(
      this.navigate().encoder.insertElementNS(namespaceURI, localName)
    )
  }
  insertStashedNode(address: number): Diff<buffer> {
    return this.update(this.navigate().encoder.insertStashedNode(address))
  }

  replaceWithText(data: string): Diff<buffer> {
    return this.update(this.navigate().encoder.replaceWithText(data))
  }
  replaceWithComment(data: string): Diff<buffer> {
    return this.update(this.navigate().encoder.replaceWithComment(data))
  }
  replaceWithElement(localName: string): Diff<buffer> {
    return this.update(this.navigate().encoder.replaceWithElement(localName))
  }
  replaceWithElementNS(namespaceURI: string, localName: string): Diff<buffer> {
    return this.update(
      this.navigate().encoder.replaceWithElementNS(namespaceURI, localName)
    )
  }
  replaceWithStashedNode(address: number): Diff<buffer> {
    return this.update(this.navigate().encoder.replaceWithStashedNode(address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Diff<buffer> {
    return this.update(
      this.navigate().encoder.editTextData(start, end, prefix, suffix)
    )
  }
  setTextData(data: string): Diff<buffer> {
    return this.update(this.navigate().encoder.setTextData(data))
  }
  setAttribute(name: string, value: string): Diff<buffer> {
    return this.update(this.navigate().encoder.setAttribute(name, value))
  }
  removeAttribute(name: string): Diff<buffer> {
    return this.update(this.navigate().encoder.removeAttribute(name))
  }
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): Diff<buffer> {
    return this.update(
      this.navigate().encoder.setAttributeNS(namespaceURI, name, value)
    )
  }
  removeAttributeNS(namespaceURI: string, name: string): Diff<buffer> {
    return this.update(
      this.navigate().encoder.removeAttributeNS(namespaceURI, name)
    )
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): Diff<buffer> {
    return this.update(this.navigate().encoder.assignProperty(name, value))
  }
  deleteProperty(name: string): Diff<buffer> {
    return this.update(this.navigate().encoder.deleteProperty(name))
  }
  setStyleRule(name: string, value: string): Diff<buffer> {
    return this.update(this.navigate().encoder.setStyleRule(name, value))
  }
  removeStyleRule(name: string): Diff<buffer> {
    return this.update(this.navigate().encoder.removeStyleRule(name))
  }

  stashNextSibling(address: number): Diff<buffer> {
    return this.updateAddress(address + 1).update(
      this.navigate().encoder.stashNextSibling(address)
    )
  }
  discardStashedNode(address: number): Diff<buffer> {
    return this.update(this.navigate().encoder.discardStashedNode(address))
  }

  encode(): buffer {
    return this.encoder.encode()
  }
}

export type { Diff }
export const encoder = <buffer>(encoder: Encoder<buffer>): Diff<buffer> =>
  new Diff(encoder, 1, [])
