/* @flow */

import type { float, integer } from "decoder.flow"
import type { Table } from "flatbuffers"
import type { Builder, Offset } from "flatbuffers"
import { DecoderError, FieldError, VariantError } from "./Error"
import * as JSONTable from "./JSON.fbs/JSON"
import unreachable from "unreachable"

export opaque type Encoded<type>: Offset = Offset

export type Value =
  | null
  | boolean
  | number
  | string
  | Value[]
  | { [string]: Value }

export class String extends JSONTable.String {
  static encode(builder: Builder, value: string): Encoded<String> {
    const offset = builder.createString(value)
    String.startString(builder)
    String.addValue(builder, offset)
    return String.endString(builder)
  }
  static decode(table: String): string | FieldError<String> {
    const value = table.value()
    if (value) {
      return value
    } else {
      return new FieldError("value", String)
    }
  }
  decode() {
    return String.decode(this)
  }
}

export class Float extends JSONTable.Float {
  static encode(builder: Builder, value: number): Encoded<Float> {
    Float.startFloat(builder)
    Float.addValue(builder, value)
    return Float.endFloat(builder)
  }
  static decode(table: Float): float | FieldError<Float> {
    const value = table.value()
    if (value) {
      return (value: any)
    } else {
      return new FieldError("value", Float)
    }
  }
  decode() {
    return Float.decode(this)
  }
}

export class Integer extends JSONTable.Integer {
  static encode(builder: Builder, value: integer): Encoded<Integer> {
    Integer.startInteger(builder)
    Integer.addValue(builder, value)
    return Integer.endInteger(builder)
  }
  static decode(table: Integer): integer | FieldError<Integer> {
    const value = table.value()
    if (value) {
      return (value: any)
    } else {
      return new FieldError("value", Integer)
    }
  }
  decode() {
    return Integer.decode(this)
  }
}

export class Boolean extends JSONTable.Boolean {
  static encode(builder: Builder, value: boolean): Encoded<Boolean> {
    Boolean.startBoolean(builder)
    Boolean.addValue(builder, value)
    return Boolean.endBoolean(builder)
  }
  static decode(table: Boolean): boolean | FieldError<Boolean> {
    const value = table.value()
    if (value) {
      return value
    } else {
      return new FieldError("value", Boolean)
    }
  }
  decode() {
    return Boolean.decode(this)
  }
}

export class Element extends JSONTable.Element {
  static encode(builder: Builder, value: Value): Encoded<Element> {
    const type = JSON.typeOf(value)
    const encodedValue =
      type === JSONTable.JSONVariant.NONE ? null : JSON.encode(builder, value)
    Element.startElement(builder)
    Element.addValueType(builder, type)
    if (encodedValue) {
      Element.addValue(builder, encodedValue)
    }
    return Element.endElement(builder)
  }
  static decode(table: Element): Value | DecoderError {
    return JSON.decode(table)
  }
  decode() {
    return Element.decode(this)
  }
}

export class JSONArray extends JSONTable.JSONArray {
  static element = new Element()
  static encode(builder: Builder, array: Value[]): Encoded<self> {
    const elements = []
    for (let element of array) {
      elements.push(Element.encode(builder, element))
    }
    const offset = JSONArray.createElementsVector(builder, elements)
    JSONArray.startJSONArray(builder)
    JSONArray.addElements(builder, offset)
    return JSONArray.endJSONArray(builder)
  }
  static decode(table: JSONArray): Value[] | DecoderError {
    const cursor = JSONArray.element
    const length = table.elementsLength()
    const elements = []
    let index = 0
    while (index < length) {
      const element = table.elements(index, cursor)
      if (element == null) {
        return new FieldError(index.toString(), JSONArray)
      } else {
        const value = Element.decode(cursor)
        if (value instanceof DecoderError) {
          return value
        } else {
          elements[index] = value
        }
      }
      index += 1
    }
    return elements
  }
  decode() {
    return JSONArray.decode(this)
  }
}

export class Property extends JSONTable.Property {
  static encode(builder: Builder, name: string, value: Value): Encoded<self> {
    const encodedName = builder.createString(name)
    const encodedValue = JSON.encode(builder, value)
    Property.startProperty(builder)
    Property.addName(builder, encodedName)
    Property.addValueType(builder, JSON.typeOf(value))
    if (encodedValue != null) {
      Property.addValue(builder, encodedValue)
    }
    return Property.endProperty(builder)
  }
}

export class JSONObject extends JSONTable.JSONObject {
  static property = new Property()
  static encode(
    builder: Builder,
    object: { [string]: Value }
  ): Encoded<JSONObject> {
    const properties = []
    for (const name of Object.keys(object)) {
      const value = object[name]
      properties.push(Property.encode(builder, name, value))
    }
    const offset = JSONTable.JSONObject.createPropertiesVector(
      builder,
      properties
    )
    JSONObject.startJSONObject(builder)
    JSONObject.addProperties(builder, offset)

    return JSONObject.endJSONObject(builder)
  }
  static decode(table: JSONObject): { [string]: Value } | DecoderError {
    const object: { [string]: Value } = (Object.create(null): Object)

    const cursor = JSONObject.property
    const length = table.propertiesLength()
    let index = 0
    while (index < length) {
      const property = table.properties(index, cursor)
      if (property == null) {
        return new FieldError(`property # ${index}`, Object)
      } else {
        const property = cursor
        const name = property.name()
        const value = JSON.decode(property)
        if (value instanceof DecoderError) {
          return value
        } else if (name == null) {
          return new FieldError("name", Property)
        } else {
          object[name] = value
        }
      }
      index += 1
    }

    return object
  }
  decode() {
    return JSONObject.decode(this)
  }
}

export default class JSON {
  static pool: { [JSONTable.JSONType]: JSONValue } = {
    [JSONTable.JSONVariant.NONE]: null,
    [JSONTable.JSONVariant.Boolean]: new Boolean(),
    [JSONTable.JSONVariant.String]: new String(),
    [JSONTable.JSONVariant.Float]: new Float(),
    [JSONTable.JSONVariant.Integer]: new Integer(),
    [JSONTable.JSONVariant.JSONArray]: new JSONArray(),
    [JSONTable.JSONVariant.JSONObject]: new JSONObject()
  }
  static from<a>(value: mixed): Value {
    return (value: any)
  }
  static typeOf(value: mixed): JSONTable.JSONType {
    switch (typeof value) {
      case "string":
        return JSONTable.JSONVariant.String
      case "boolean":
        return JSONTable.JSONVariant.Boolean
      case "number":
        return JSONTable.JSONVariant.Float
      default: {
        if (value === null) {
          return JSONTable.JSONVariant.NONE
        } else {
          return JSONTable.JSONVariant.JSONObject
        }
      }
    }
  }
  static encode(builder: Builder, value: Value): EncodedJSON {
    switch (typeof value) {
      case "string": {
        return String.encode(builder, value)
      }
      case "number": {
        return Float.encode(builder, value)
      }
      case "boolean": {
        return Boolean.encode(builder, value)
      }
      case "object": {
        if (value === null) {
          return null
        } else if (Array.isArray(value)) {
          return JSONArray.encode(builder, value)
        } else {
          return JSONObject.encode(builder, value)
        }
      }
      default:
        return unreachable(value)
    }
  }
  static decode(table: {
    valueType(): JSONTable.JSONType,
    value<t: Table>(t): ?t
  }): Value | DecoderError {
    const type = table.valueType()
    const variant = JSON.pool[type]
    if (variant == null) {
      return null
    } else {
      const value = table.value(variant)
      if (value) {
        return value.decode()
      } else {
        return new VariantError(JSON, JSONTable.JSONVariant, type)
      }
    }
  }
}

type JSONValue =
  | null
  | JSONArray
  | JSONObject
  | String
  | Boolean
  | Float
  | Integer

type EncodedJSON =
  | null
  | Encoded<JSONArray>
  | Encoded<JSONObject>
  | Encoded<String>
  | Encoded<Boolean>
  | Encoded<Float>
  | Encoded<Integer>
