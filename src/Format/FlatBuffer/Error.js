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
  table: Class<a>
  constructor(fieldName: string, table: Class<a>) {
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
