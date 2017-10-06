/* @flow */

import * as DOMinion from "../"
import FlatBuffer from "../lib/Format/FlatBuffer"
import { createHost, diff } from "./Util"
import test from "blue-tape"
import { JSDOM } from "jsdom"

test("https://github.com/whatwg/dom/issues/270", async test => {
  const { window } = new JSDOM(
    `<article id="main-article" data-pending="yes">Some text</article>`
  )
  const article = window.document.getElementById("main-article")
  const ChangeList = FlatBuffer.Encoder

  const changeList = ChangeList.encoder()

  ChangeList.selectChildren(changeList)
  ChangeList.selectSibling(changeList, 1)
  ChangeList.setTextData(changeList, "Hello world")
  ChangeList.selectParent(changeList)
  ChangeList.setAttribute(changeList, "data-active", "yes")
  ChangeList.removeAttribute(changeList, "data-pending")

  const host = DOMinion.mount(article)
  const buffer = ChangeList.toUint8Array(changeList)
  DOMinion.patch(host, FlatBuffer.decode(buffer))

  test.equal(
    article.outerHTML,
    `<article id="main-article" data-active="yes">Hello world</article>`
  )
})
