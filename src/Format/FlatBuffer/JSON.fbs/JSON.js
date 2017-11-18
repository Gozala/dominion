// @flow

// Transformed verison of fbs.ts
// Replace import {flatbuffers} -> import * as flatbuffers
// Comment out all `export namespace JSON{` and corresponding `}`
// Rewrite enums to Type and value pairs.
// Replace '<T extends' with '<T:'
// Rewrite all overloads for string field methods.
// Replace flatbuffers.Encoding with flatbuffers.EncodingValue

import * as flatbuffers from "flatbuffers"

/**
 * @enum
 */
// export namespace JSON{
export const JSONVariant = {
  NONE: (0: 0),
  Boolean: (1: 1),
  Integer: (2: 2),
  Float: (3: 3),
  String: (4: 4),
  JSONArray: (5: 5),
  JSONObject: (6: 6)
}
//};

export type JSONType = $Values<typeof JSONVariant>

/**
 * @constructor
 */
// export namespace JSON{
export class JSONArray {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {JSONArray}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): self {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {JSONArray=} obj
 * @returns {JSONArray}
 */
  static getRootAsJSONArray(bb: flatbuffers.ByteBuffer, obj?: self): self {
    return (obj || new this.constructor()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {number} index
 * @param {Element=} obj
 * @returns {Element}
 */
  elements(index: number, obj?: Element): Element | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Element()).__init(
          this.bb.__indirect(
            this.bb.__vector(this.bb_pos + offset) + index * 4
          ),
          this.bb
        )
      : null
  }

  /**
 * @returns {number}
 */
  elementsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startJSONArray(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} elementsOffset
 */
  static addElements(
    builder: flatbuffers.Builder,
    elementsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, elementsOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {JSONArray.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
  static createElementsVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset {
    builder.startVector(4, data.length, 4)
    for (var i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i])
    }
    return builder.endVector()
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
  static startElementsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endJSONArray(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class JSONObject {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {JSONObject}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): JSONObject {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {JSONObject=} obj
 * @returns {JSONObject}
 */
  static getRootAsJSONObject(
    bb: flatbuffers.ByteBuffer,
    obj?: JSONObject
  ): JSONObject {
    return (obj || new JSONObject()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {number} index
 * @param {Property=} obj
 * @returns {Property}
 */
  properties(index: number, obj?: Property): Property | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Property()).__init(
          this.bb.__indirect(
            this.bb.__vector(this.bb_pos + offset) + index * 4
          ),
          this.bb
        )
      : null
  }

  /**
 * @returns {number}
 */
  propertiesLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startJSONObject(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} propertiesOffset
 */
  static addProperties(
    builder: flatbuffers.Builder,
    propertiesOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, propertiesOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {JSONArray.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
  static createPropertiesVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset {
    builder.startVector(4, data.length, 4)
    for (var i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i])
    }
    return builder.endVector()
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
  static startPropertiesVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endJSONObject(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class Property {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Property}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Property {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Property=} obj
 * @returns {Property}
 */
  static getRootAsProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: Property
  ): Property {
    return (obj || new Property()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {flatbuffers.EncodingValue=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
  name(
    optionalEncoding?: flatbuffers.EncodingValue
  ):
    | string
    | null /*
name(optionalEncoding:flatbuffers.EncodingValue):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null*/ {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
 * @returns {JSONType}
 */
  valueType(): JSONType {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? /** @type {JSONType} */ ((this.bb.readUint8(this.bb_pos + offset): any))
      : JSONVariant.NONE
  }

  /**
 * @param {flatbuffers.Table} obj
 * @returns {?flatbuffers.Table}
 */
  value<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startProperty(builder: flatbuffers.Builder) {
    builder.startObject(3)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} nameOffset
 */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {JSONType} valueType
 */
  static addValueType(builder: flatbuffers.Builder, valueType: JSONType) {
    builder.addFieldInt8(1, valueType, JSONVariant.NONE)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} valueOffset
 */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, valueOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endProperty(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class Element {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Element}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Element {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Element=} obj
 * @returns {Element}
 */
  static getRootAsElement(bb: flatbuffers.ByteBuffer, obj?: Element): Element {
    return (obj || new Element()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @returns {JSONType}
 */
  valueType(): JSONType {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? /** @type {JSONType} */ ((this.bb.readUint8(this.bb_pos + offset): any))
      : JSONVariant.NONE
  }

  /**
 * @param {flatbuffers.Table} obj
 * @returns {?flatbuffers.Table}
 */
  value<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startElement(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {JSONType} valueType
 */
  static addValueType(builder: flatbuffers.Builder, valueType: JSONType) {
    builder.addFieldInt8(0, valueType, JSONVariant.NONE)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} valueOffset
 */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, valueOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endElement(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class Boolean {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Boolean}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Boolean {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Boolean=} obj
 * @returns {Boolean}
 */
  static getRootAsBoolean(bb: flatbuffers.ByteBuffer, obj?: Boolean): Boolean {
    return (obj || new Boolean()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @returns {boolean}
 */
  value(): boolean {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startBoolean(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {boolean} value
 */
  static addValue(builder: flatbuffers.Builder, value: boolean) {
    builder.addFieldInt8(0, +value, +false)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endBoolean(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class Integer {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Integer}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Integer {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Integer=} obj
 * @returns {Integer}
 */
  static getRootAsInteger(bb: flatbuffers.ByteBuffer, obj?: Integer): Integer {
    return (obj || new Integer()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @returns {number}
 */
  value(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startInteger(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {number} value
 */
  static addValue(builder: flatbuffers.Builder, value: number) {
    builder.addFieldInt32(0, value, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endInteger(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class String {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {String}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): String {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {String=} obj
 * @returns {String}
 */
  static getRootAsString(bb: flatbuffers.ByteBuffer, obj?: String): String {
    return (obj || new String()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {flatbuffers.EncodingValue=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
  value(
    optionalEncoding?: flatbuffers.EncodingValue
  ):
    | string
    | null /*
value(optionalEncoding:flatbuffers.EncodingValue):string|Uint8Array|null
value(optionalEncoding?:any):string|Uint8Array|null*/ {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startString(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} valueOffset
 */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, valueOffset, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endString(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}
/**
 * @constructor
 */
// export namespace JSON{
export class Float {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {Float}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Float {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Float=} obj
 * @returns {Float}
 */
  static getRootAsFloat(bb: flatbuffers.ByteBuffer, obj?: Float): Float {
    return (obj || new Float()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @returns {number}
 */
  value(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readFloat32(this.bb_pos + offset) : 0.0
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startFloat(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {number} value
 */
  static addValue(builder: flatbuffers.Builder, value: number) {
    builder.addFieldFloat32(0, value, 0.0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endFloat(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
//}

export type JSON =
  | null
  | Boolean
  | Integer
  | Float
  | String
  | JSONArray
  | JSONObject