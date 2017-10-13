/* @flow */

interface Empty<a> {
  isEmpty: true;
  length: 0;
  push(item: a): List<a>;
  toArray(): Array<a>;
}

interface Linked<a> {
  isEmpty: false;
  length: number;
  head: a;
  tail: List<a>;
  push(item: a): List<a>;
  toArray(): Array<a>;
}

export type List<a> = Empty<a> | Linked<a>

class EmptyList<a> implements Empty<a> {
  length = 0
  isEmpty = true
  toArray(): a[] {
    return nil
  }
  push(head: a): Linked<a> {
    return new LinkedList(head, this)
  }
}

class LinkedList<a> implements Linked<a> {
  head: a
  tail: List<a>
  length: number
  isEmpty = false
  constructor(head: a, tail: List<a>) {
    this.head = head
    this.tail = tail
    this.length = this.tail.length + 1
  }
  push(head: a): List<a> {
    return new LinkedList(head, this)
  }
  toArray(): a[] {
    const array = []
    let node = this
    while (node.isEmpty === false) {
      array.push(node.head)
      node = node.tail
    }
    return array
  }
}

const nil: any[] = Object.freeze([])
const emptyList: List<any> = new EmptyList()

export const empty = <a>(): List<a> => emptyList
export const singleton = <a>(head: a): List<a> =>
  new LinkedList(head, emptyList)
export const push = <a>(head: a, tail: List<a>): List<a> =>
  new LinkedList(head, tail)
