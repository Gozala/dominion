/* @flow */

export opaque type COMMENT_NODE = 8

export interface Comment<message> {
  nodeType: COMMENT_NODE,
  text: string
}

export const nodeType: COMMENT_NODE = 8
