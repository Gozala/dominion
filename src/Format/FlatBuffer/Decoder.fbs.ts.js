// @flow

// Transformed verison of fbs.ts
// Replace import {flatbuffers} -> import * as flatbuffers
// Comment out all `// export namespace Decoder{` and corresponding `}`
// Rewrite enums to Type and value pairs.
// Replace '<T extends' with '<T:'
// Rewrite all overloads for string field methods.
// Replace 'Decoder.Decoder.' with 'decoderType.'
// Replace 'JSON.' with 'jsonType.'
// Replace 'Value.' with 'valueType.'
// Replace 'Decoder.' with ''
// Replace all '/** @type {Decoder} */ (this.bb.readUint8(this.bb_pos + offset))' with `((this.bb.readUint8(this.bb_pos + offset):any):Decoder)`
// Replace all `/** @type {Value} */ (this.bb.readInt8(this.bb_pos + offset))` with `((this.bb.readInt8(this.bb_pos + offset):any):Value)`
// Replace all `/** @type {JSON} */ (this.bb.readUint8(this.bb_pos + offset))` with `((this.bb.readUint8(this.bb_pos + offset):any):JSON)`

import * as flatbuffers from "flatbuffers"

/**
 * @enum
 */
// // export namespace Decoder{
export const decoder = {
  NONE: (0: 0),
  Error: (1: 1),
  Ok: (2: 2),
  Primitive: (3: 3),
  Accessor: (4: 4),
  Either: (5: 5),
  Field: (6: 6),
  Index: (7: 7),
  Null: (8: 8),
  Undefined: (9: 9),
  Optional: (10: 10),
  Maybe: (11: 11),
  Collection: (12: 12),
  Dictionary: (13: 13),
  Record: (14: 14),
  Form: (15: 15)
}

export type Decoder = $Values<typeof decoder>
// };

/**
 * @enum
 */
// // export namespace Decoder{
export const value = {
  Null: (0: 0),
  Boolean: (1: 1),
  Integer: (2: 2),
  Float: (3: 3),
  String: (4: 4),
  JSON: (5: 5)
}

export type Value = $Values<typeof value>
//}

/**
 * @enum
 */
// // export namespace Decoder{
export const json = {
  NONE: (0: 0),
  Boolean: (1: 1),
  Integer: (2: 2),
  Float: (3: 3),
  String: (4: 4),
  JSONArray: (5: 5),
  JSONObject: (6: 6)
}

export type JSON = $Values<typeof json>
// };

/**
 * @constructor
 */
// // export namespace Decoder{
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
  __init(i: number, bb: flatbuffers.ByteBuffer): JSONArray {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {JSONArray=} obj
   * @returns {JSONArray}
   */
  static getRootAsJSONArray(
    bb: flatbuffers.ByteBuffer,
    obj?: JSONArray
  ): JSONArray {
    return (obj || new JSONArray()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {JSONElement=} obj
   * @returns {JSONElement}
   */
  elements(index: number, obj?: JSONElement): JSONElement | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new JSONElement()).__init(
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
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createElementsVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset | null {
    if (!data) {
      return null
    }
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
// }
/**
   * @constructor
   */
// // export namespace Decoder{
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
   * @param {JSONProperty=} obj
   * @returns {JSONProperty}
   */
  propreties(index: number, obj?: JSONProperty): JSONProperty | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new JSONProperty()).__init(
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
  propretiesLength(): number {
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
   * @param {flatbuffers.Offset} propretiesOffset
   */
  static addPropreties(
    builder: flatbuffers.Builder,
    propretiesOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, propretiesOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createPropretiesVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset | null {
    if (!data) {
      return null
    }
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
  static startPropretiesVector(builder: flatbuffers.Builder, numElems: number) {
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
// }
/**
   * @constructor
   */
// // export namespace Decoder{
export class JSONProperty {
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
   * @returns {JSONProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): JSONProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {JSONProperty=} obj
   * @returns {JSONProperty}
   */
  static getRootAsJSONProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: JSONProperty
  ): JSONProperty {
    return (obj || new JSONProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: any): string | null {
    // //name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    // //name(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {JSON}
   */
  valueType(): JSON {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? /** @type {JSON} */ ((this.bb.readUint8(this.bb_pos + offset): any))
      : json.NONE
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
  static startJSONProperty(builder: flatbuffers.Builder) {
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
   * @param {JSON} valueType
   */
  static addValueType(builder: flatbuffers.Builder, valueType: JSON) {
    builder.addFieldInt8(1, valueType, json.NONE)
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
  static endJSONProperty(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
/**
   * @constructor
   */
// // export namespace Decoder{
export class JSONElement {
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
   * @returns {JSONElement}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): JSONElement {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {JSONElement=} obj
   * @returns {JSONElement}
   */
  static getRootAsJSONElement(
    bb: flatbuffers.ByteBuffer,
    obj?: JSONElement
  ): JSONElement {
    return (obj || new JSONElement()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  valueType(): JSON {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? /** @type {JSON} */ ((this.bb.readUint8(this.bb_pos + offset): any))
      : json.NONE
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
  static startJSONElement(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} valueType
   */
  static addValueType(builder: flatbuffers.Builder, valueType: JSON) {
    builder.addFieldInt8(0, valueType, json.NONE)
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
  static endJSONElement(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }

/**
 * @constructor
 */
// export namespace Decoder{
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

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
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

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
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
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  value(optionalEncoding?: any): string | null {
    //value(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //value(optionalEncoding?:any):string|Uint8Array|null {
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

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
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

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Accessor {
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
   * @returns {Accessor}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Accessor {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Accessor=} obj
   * @returns {Accessor}
   */
  static getRootAsAccessor(
    bb: flatbuffers.ByteBuffer,
    obj?: Accessor
  ): Accessor {
    return (obj || new Accessor()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: any): string | null {
    //name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //name(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {Decoder}
   */
  accessorType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  accessor<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAccessor(builder: flatbuffers.Builder) {
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
   * @param {Decoder} accessorType
   */
  static addAccessorType(builder: flatbuffers.Builder, accessorType: Decoder) {
    builder.addFieldInt8(1, accessorType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} accessorOffset
   */
  static addAccessor(
    builder: flatbuffers.Builder,
    accessorOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, accessorOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAccessor(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Collection {
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
   * @returns {Collection}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Collection {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Collection=} obj
   * @returns {Collection}
   */
  static getRootAsCollection(
    bb: flatbuffers.ByteBuffer,
    obj?: Collection
  ): Collection {
    return (obj || new Collection()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  itemType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  item<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startCollection(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} itemType
   */
  static addItemType(builder: flatbuffers.Builder, itemType: Decoder) {
    builder.addFieldInt8(0, itemType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} itemOffset
   */
  static addItem(builder: flatbuffers.Builder, itemOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, itemOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endCollection(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Primitive {
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
   * @returns {Primitive}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Primitive {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Primitive=} obj
   * @returns {Primitive}
   */
  static getRootAsPrimitive(
    bb: flatbuffers.ByteBuffer,
    obj?: Primitive
  ): Primitive {
    return (obj || new Primitive()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Value}
   */
  type(): Value {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readInt8(this.bb_pos + offset): any): Value)
      : value.Null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startPrimitive(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Value} type
   */
  static addType(builder: flatbuffers.Builder, type: Value) {
    builder.addFieldInt8(0, type, value.Null)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endPrimitive(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Dictionary {
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
   * @returns {Dictionary}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Dictionary {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Dictionary=} obj
   * @returns {Dictionary}
   */
  static getRootAsDictionary(
    bb: flatbuffers.ByteBuffer,
    obj?: Dictionary
  ): Dictionary {
    return (obj || new Dictionary()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  dictionaryType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  dictionary<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startDictionary(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} dictionaryType
   */
  static addDictionaryType(
    builder: flatbuffers.Builder,
    dictionaryType: Decoder
  ) {
    builder.addFieldInt8(0, dictionaryType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dictionaryOffset
   */
  static addDictionary(
    builder: flatbuffers.Builder,
    dictionaryOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, dictionaryOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endDictionary(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Either {
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
   * @returns {Either}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Either {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Either=} obj
   * @returns {Either}
   */
  static getRootAsEither(bb: flatbuffers.ByteBuffer, obj?: Either): Either {
    return (obj || new Either()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Variant=} obj
   * @returns {Variant}
   */
  variants(index: number, obj?: Variant): Variant | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Variant()).__init(
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
  variantsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startEither(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} variantsOffset
   */
  static addVariants(
    builder: flatbuffers.Builder,
    variantsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, variantsOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createVariantsVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset | null {
    if (!data) {
      return null
    }
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
  static startVariantsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endEither(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Variant {
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
   * @returns {Variant}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Variant {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Variant=} obj
   * @returns {Variant}
   */
  static getRootAsVariant(bb: flatbuffers.ByteBuffer, obj?: Variant): Variant {
    return (obj || new Variant()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  variantType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  variant<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startVariant(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} variantType
   */
  static addVariantType(builder: flatbuffers.Builder, variantType: Decoder) {
    builder.addFieldInt8(0, variantType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} variantOffset
   */
  static addVariant(
    builder: flatbuffers.Builder,
    variantOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, variantOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endVariant(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Error {
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
   * @returns {Error}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Error {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Error=} obj
   * @returns {Error}
   */
  static getRootAsError(bb: flatbuffers.ByteBuffer, obj?: Error): Error {
    return (obj || new Error()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  message(optionalEncoding?: any): string | null {
    //message(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //message(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startError(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} messageOffset
   */
  static addMessage(
    builder: flatbuffers.Builder,
    messageOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, messageOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endError(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Ok {
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
   * @returns {Ok}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Ok {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Ok=} obj
   * @returns {Ok}
   */
  static getRootAsOk(bb: flatbuffers.ByteBuffer, obj?: Ok): Ok {
    return (obj || new Ok()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  okType(): JSON {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON)
      : json.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  ok<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startOk(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} okType
   */
  static addOkType(builder: flatbuffers.Builder, okType: JSON) {
    builder.addFieldInt8(0, okType, json.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} okOffset
   */
  static addOk(builder: flatbuffers.Builder, okOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, okOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endOk(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Field {
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
   * @returns {Field}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Field {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Field=} obj
   * @returns {Field}
   */
  static getRootAsField(bb: flatbuffers.ByteBuffer, obj?: Field): Field {
    return (obj || new Field()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: any): string | null {
    //name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //name(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {Decoder}
   */
  fieldType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  field<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startField(builder: flatbuffers.Builder) {
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
   * @param {Decoder} fieldType
   */
  static addFieldType(builder: flatbuffers.Builder, fieldType: Decoder) {
    builder.addFieldInt8(1, fieldType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} fieldOffset
   */
  static addField(
    builder: flatbuffers.Builder,
    fieldOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, fieldOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endField(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Index {
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
   * @returns {Index}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Index {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Index=} obj
   * @returns {Index}
   */
  static getRootAsIndex(bb: flatbuffers.ByteBuffer, obj?: Index): Index {
    return (obj || new Index()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  index(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @returns {Decoder}
   */
  memberType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  member<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startIndex(builder: flatbuffers.Builder) {
    builder.startObject(3)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} index
   */
  static addIndex(builder: flatbuffers.Builder, index: number) {
    builder.addFieldInt32(0, index, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} memberType
   */
  static addMemberType(builder: flatbuffers.Builder, memberType: Decoder) {
    builder.addFieldInt8(1, memberType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} memberOffset
   */
  static addMember(
    builder: flatbuffers.Builder,
    memberOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, memberOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endIndex(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Form {
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
   * @returns {Form}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Form {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Form=} obj
   * @returns {Form}
   */
  static getRootAsForm(bb: flatbuffers.ByteBuffer, obj?: Form): Form {
    return (obj || new Form()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Field=} obj
   * @returns {Field}
   */
  form(index: number, obj?: Field): Field | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Field()).__init(
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
  formLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startForm(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} formOffset
   */
  static addForm(builder: flatbuffers.Builder, formOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, formOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createFormVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset | null {
    if (!data) {
      return null
    }
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
  static startFormVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endForm(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Record {
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
   * @returns {Record}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Record {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Record=} obj
   * @returns {Record}
   */
  static getRootAsRecord(bb: flatbuffers.ByteBuffer, obj?: Record): Record {
    return (obj || new Record()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Field=} obj
   * @returns {Field}
   */
  fields(index: number, obj?: Field): Field | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Field()).__init(
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
  fieldsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startRecord(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} fieldsOffset
   */
  static addFields(
    builder: flatbuffers.Builder,
    fieldsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, fieldsOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createFieldsVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset | null {
    if (!data) {
      return null
    }
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
  static startFieldsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endRecord(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Maybe {
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
   * @returns {Maybe}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Maybe {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Maybe=} obj
   * @returns {Maybe}
   */
  static getRootAsMaybe(bb: flatbuffers.ByteBuffer, obj?: Maybe): Maybe {
    return (obj || new Maybe()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  maybeType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  maybe<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startMaybe(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} maybeType
   */
  static addMaybeType(builder: flatbuffers.Builder, maybeType: Decoder) {
    builder.addFieldInt8(0, maybeType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} maybeOffset
   */
  static addMaybe(
    builder: flatbuffers.Builder,
    maybeOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, maybeOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endMaybe(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Null {
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
   * @returns {Null}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Null {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Null=} obj
   * @returns {Null}
   */
  static getRootAsNull(bb: flatbuffers.ByteBuffer, obj?: Null): Null {
    return (obj || new Null()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  NullType(): JSON {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON)
      : json.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  Null<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startNull(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} NullType
   */
  static addNullType(builder: flatbuffers.Builder, NullType: JSON) {
    builder.addFieldInt8(0, NullType, json.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} NullOffset
   */
  static addNull(builder: flatbuffers.Builder, NullOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, NullOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endNull(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Undefined {
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
   * @returns {Undefined}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Undefined {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Undefined=} obj
   * @returns {Undefined}
   */
  static getRootAsUndefined(
    bb: flatbuffers.ByteBuffer,
    obj?: Undefined
  ): Undefined {
    return (obj || new Undefined()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  UndefinedType(): JSON {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON)
      : json.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  Undefined<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startUndefined(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} UndefinedType
   */
  static addUndefinedType(builder: flatbuffers.Builder, UndefinedType: JSON) {
    builder.addFieldInt8(0, UndefinedType, json.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} UndefinedOffset
   */
  static addUndefined(
    builder: flatbuffers.Builder,
    UndefinedOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, UndefinedOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endUndefined(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Optional {
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
   * @returns {Optional}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Optional {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Optional=} obj
   * @returns {Optional}
   */
  static getRootAsOptional(
    bb: flatbuffers.ByteBuffer,
    obj?: Optional
  ): Optional {
    return (obj || new Optional()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  optionalType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  optional<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startOptional(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} optionalType
   */
  static addOptionalType(builder: flatbuffers.Builder, optionalType: Decoder) {
    builder.addFieldInt8(0, optionalType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} optionalOffset
   */
  static addOptional(
    builder: flatbuffers.Builder,
    optionalOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, optionalOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endOptional(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
