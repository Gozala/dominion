# DOMinion
[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]


Library for describing & applying DOM changes with a primary emphasys of moving DOM UI work off the UI thread. Library provides Virtual DOM abstraction that application could use to in the web worker to describe the UI state. Versions of Virtual DOM can be diffed to produce a changelist encoded in  efficient format like `UintArray8` that is transferable to a UI thread where changlist can be then applied to an actual DOM tree. Library is designed to support use case without Virtual DOM abstraction (like Ember) by allowing direct authoring of DOM changelists that again can be encoded into `UintArray8` in the web worker and then applied back on the main thread.

## Current State

At the moment library reached milestone where it can be put out there for feedback. Test coverage is shameful, so expect bugs. In fact main reasons to publish it this early is to get help with that.

There is one big piece missing to make this library useful - **Event Handling**. Which is quite a challenge both from design and implementation standpoint & one of the major humps to moving UI off the main thread. Plan is to utilize [decoder.flow][] for describing "event decoders" that declaratively can describe what data to extract from DOM (event) when it occurs that can be encoded in the same efficent format as changelist and passed over to the worker (where appliaction will run) to update state & UI as necessary. And yes sometimes you'd need to make certain decisions in the UI thread like cancelling events and decoders could do that too by decoding to value like `{message:ArrayBuffer, preventDefault?:boolean, stopPropagation?:boolean}`. There still might be some cases where this is not enough and those likely will get a solutions optimized case by case.

## Usage

### Import

Rest of the the document & provided code examples assumes that library is installed (with yarn or npm) and imported as follows:

```js
import * as DOMinion from "dominion"
```

### Virtual DOM

Virtual DOM API assumes some host DOM element to which changes will be applied. Library provides `DOMinion.createHost` function to create virtual presentation of that host element.

```js
const v1 = DOMinion.createHost()
```

It is possibel to describe changes to the host attributes and children but it is not possible to change a host element itself (say from `div` to `span`).

```js
const v2 = DOMinion.createHost(
  [],
  [
    DOMinion.createElement(
      "div",
      [
        DOMinion.setAttribute("id", "main"),
        DOMinion.property("autofocus", true),
        DOMinion.style({
          backgroundColor: "red",
          color: "white"
        })
      ],
      [
        DOMinion.createTextNode("hi there"),
        DOMinion.createComment("this is some comment"),
        DOMinion.createElementNS("http://www.w3.org/2000/svg", "circle", [
          DOMinion.setAttribute("cx", "40"),
          DOMinion.setAttribute("cy", "50"),
          DOMinion.setAttribute("r", "26")
        ])
      ]
    )
  ]
)
```

Changelist can be calculated by running a diff between version of the tree and encoded into efficient representation. Please note that diff-ing and encoding happens in a single iteration and avoids additional allocations to what encoder uses. Mostly we'll focuse on FlatBuffer encoder that uses Google's [flatbuffer][] library to effiently encode changelist into `Uint8Array`.

```js
const changeList1 = DOMinion.diff(v1, v2)
const buffer1 = DOMinion.FlatBuffer.encode(changeList1)
if (!buffer1.isError) {
    self.postMessage({type:'changeList', changeList:buffer1} [buffer1])
}
```

Similarily changelists can be decoded and applied to the host DOM element in single iteration and avoiding additional alloactions.

```js
const host = DOMinion.mount(document.body)
worker.onmessage = (event) => {
  const {changeList} = event.data
  DOMinion.patch(host, FlatBuffer.decode(changeList))
}
```


### ChangeList without Virtual DOM

As mentioned you don't have to use Virtual DOM abstraction to encode / apply changes you could use lower-lever API to encode changes directly:

```js
import { flatbuffers } from "flatbuffers"
const ChangeList = DOMinion.FlatBuffer.Encoder

const changeList = ChangeList.encoder()

ChangeList.selectChildren(changeList)
ChangeList.insertElement(changeList, 'div')
ChangeList.removeNextSibling(changeList, 1)
ChangeList.setAttribute(changeList, 'id', 'main')
ChangeList.selectChildren(changeList)
ChangeList.insertElement(changeList, 'p')
// ...

const buffer = ChangeList.toUint8Array(changeList)
self.postMessage({type:'changeList', changeList:buffer} [buffer])
```

On the UI thread things would be same as in previously.

### Direct encoding

It is certainly possibly to avoid `FlatBuffer.decode(FlatBuffer.encode(changeList))` and do directly `DOMinion.patch(host, changeList)` which would diff and patch in the same cycle but then emphasis is to move move things off UI thread and if you do you'd need to transfer changeList efficiently across threads and that's what plugable encode / decode allows you to do. You could in fact implement custom encoder that would even stream changeList as it's being written but that's not necesserily good idea either is application of changes will no longer be atomic.

### Any more crazy ideas ?

In fact Yes! Representing DOM via `Uint8Array` has some interesting implications, for instance other languages (think WASM) could represent and change DOM on a separate thread and use just the `patch` from this library to change actual DOM. In fact [flatbuffer][] library is going to do the half of the work there in supporting other languages. Finally @wycats has made [whatwg proposal][] to add applicaton of changelists part of DOM API and if that happens `patch` will be natively supported.

## Install

    npm install dominion

[decoder.flow]:https://github.com/gozala/decoder.flow
[flatbuffer]:https://google.github.io/flatbuffers/
[whatwg proposal]:https://github.com/whatwg/dom/issues/270

[travis.icon]: https://travis-ci.org/Gozala/dominion.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/dominion

[version.icon]: https://img.shields.io/npm/v/dominion.svg
[downloads.icon]: https://img.shields.io/npm/dm/dominion.svg
[package.url]: https://npmjs.org/package/dominion


[downloads.image]: https://img.shields.io/npm/dm/dominion.svg
[downloads.url]: https://npmjs.org/package/dominion

[prettier.icon]:https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]:https://github.com/prettier/prettier