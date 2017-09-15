/* @flow */

export opaque type TEXT_NODE = 3

export interface Text<message> {
  nodeType: TEXT_NODE,
  text: string,
  toDebugString(): string
}

export const type: TEXT_NODE = 3
