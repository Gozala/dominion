/* @flow */

import type { Encoder, Decoder } from "../Log"

type Nav = [-1 | 0 | 1, number]

class NavigationEncoder<buffer> implements Encoder<buffer> {
  encoder: Encoder<buffer>
  navigationLog: Nav[]
  address: number
  constructor(encoder: Encoder<buffer>, address: number, navigationLog: Nav[]) {
    this.reset(encoder, address, navigationLog)
  }
  reset(encoder: Encoder<buffer>, address: number, navigationLog: Nav[]): self {
    this.encoder = encoder
    this.address = address
    this.navigationLog = navigationLog
    return this
  }
  updateAddress(address: number): self {
    return this.reset(this.encoder, address, this.navigationLog)
  }
  updateNavigationLog(navigationLog: Nav[]): self {
    return this.reset(this.encoder, this.address, navigationLog)
  }

  update(encoder: Encoder<buffer>): self {
    return this.reset(encoder, this.address, this.navigationLog)
  }
  navigate(): self {
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

  selectChildren(): self {
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
  selectSibling(offset: number): self {
    const { navigationLog, encoder } = this
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog.shift()
    navigationLog.unshift([level, index + offset])

    return this.updateNavigationLog(navigationLog)
  }
  selectParent(): self {
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
  removeNextSibling(): self {
    return this.update(this.navigate().encoder.removeNextSibling())
  }

  insertText(data: string): self {
    return this.update(this.navigate().encoder.insertText(data))
  }
  insertComment(data: string): self {
    return this.update(this.navigate().encoder.insertComment(data))
  }
  insertElement(localName: string): self {
    return this.update(this.navigate().encoder.insertElement(localName))
  }
  insertElementNS(namespaceURI: string, localName: string): self {
    return this.update(
      this.navigate().encoder.insertElementNS(namespaceURI, localName)
    )
  }
  insertStashedNode(address: number): self {
    return this.update(this.navigate().encoder.insertStashedNode(address))
  }

  replaceWithText(data: string): self {
    return this.update(this.navigate().encoder.replaceWithText(data))
  }
  replaceWithComment(data: string): self {
    return this.update(this.navigate().encoder.replaceWithComment(data))
  }
  replaceWithElement(localName: string): self {
    return this.update(this.navigate().encoder.replaceWithElement(localName))
  }
  replaceWithElementNS(namespaceURI: string, localName: string): self {
    return this.update(
      this.navigate().encoder.replaceWithElement(namespaceURI, localName)
    )
  }
  replaceWithStashedNode(address: number): self {
    return this.update(this.navigate().encoder.replaceWithStashedNode(address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): self {
    return this.update(
      this.navigate().encoder.editTextData(start, end, prefix, suffix)
    )
  }
  setTextData(data: string): self {
    return this.update(this.navigate().encoder.setTextData(data))
  }
  setAttribute(name: string, value: string): self {
    return this.update(this.navigate().encoder.setAttribute(name, value))
  }
  removeAttribute(name: string): self {
    return this.update(this.navigate().encoder.removeAttribute(name))
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): self {
    return this.update(
      this.navigate().encoder.setAttributeNS(namespaceURI, name, value)
    )
  }
  removeAttributeNS(namespaceURI: string, name: string): self {
    return this.update(
      this.navigate().encoder.removeAttributeNS(namespaceURI, name)
    )
  }
  assignProperty(name: string, value: string | number | boolean | null): self {
    return this.update(this.navigate().encoder.assignProperty(name, value))
  }
  deleteProperty(name: string): self {
    return this.update(this.navigate().encoder.deleteProperty(name))
  }
  setStyleRule(name: string, value: string): self {
    return this.update(this.navigate().encoder.setStyleRule(name, value))
  }
  removeStyleRule(name: string): self {
    return this.update(this.navigate().encoder.removeStyleRule(name))
  }

  stashNextSibling(address): self {
    return this.updateAddress(address + 1).update(
      this.navigate().encoder.stashNextSibling(address)
    )
  }
  discardStashedNode(address: number): self {
    return this.update(this.navigate().encoder.discardStashedNode(address))
  }

  encode(): buffer {
    return this.encoder.encode()
  }
}

export const navigator = <buffer>(encoder: Encoder<buffer>): Encoder<buffer> =>
  new NavigationEncoder(encoder, 1, [])
