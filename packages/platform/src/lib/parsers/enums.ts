export enum QueryType {
  STRING = "STRING",
  MULTI_STRING = "MULTI_STRING",
  RANGE = "RANGE",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  DATE = "DATE",
  UNIT = "UNIT",
}

export enum QueryOperator {
  CONTAINS = "CONTAINS", // For substring match
  EQUALS = "EQUALS", // For exact match
  NOT_EQUALS = "NOT_EQUALS", // For exact match
  IN = "IN", // For arrays
  NOT_IN = "NOT_IN", // For arrays
  GREATER_THAN = "GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",
}
