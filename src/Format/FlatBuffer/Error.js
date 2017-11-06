/* @flow */

export class DecoderError {
  +format: (context?: string) => string
  toString(): string {
    return this.format()
  }
  isError = true
}

export class FieldError<a> extends DecoderError {
  kind: "FieldError" = "FieldError"
  fieldName: string
  table: Class<a> & { name: string }
  constructor(fieldName: string, table: Class<a> & { name: string }) {
    super()
    this.table = table
    this.fieldName = fieldName
  }
  format(context?: string): string {
    const where = context == null ? "" : `at ${context}`
    return `Faild to decode a field "${this.fieldName}" from "${this.table
      .name}" table${where}`
  }
}

export class VariantError<a> extends DecoderError {
  kind: "VariantError" = "VariantError"
  table: Class<a> & { name: string }
  options: { [string]: number }
  option: number
  constructor(
    table: Class<a> & { name: string },
    options: { [string]: number },
    option: number
  ) {
    super()
    this.table = table
    this.options = options
    this.option = option
  }
  format(context?: string): string {
    const { options, option } = this
    const where = context == null ? "" : `at ${context}`
    let optionName = ""
    for (let key in options) {
      if (options[key] === option) {
        optionName = key
        break
      }
    }

    return `Faild to decode a union "${this.table
      .name}" as ${optionName}:${option}`
  }
}
