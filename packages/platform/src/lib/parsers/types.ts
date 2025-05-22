import { QueryOperator, QueryType } from "./enums";

export type AvailableStringOperators =
  | QueryOperator.EQUALS
  | QueryOperator.NOT_EQUALS
  | QueryOperator.CONTAINS;

export type AvailableMultiOperators = QueryOperator.IN | QueryOperator.NOT_IN;

export type AvailableRangeStartOperators =
  | QueryOperator.GREATER_THAN
  | QueryOperator.GREATER_THAN_OR_EQUAL;

export type AvailableRangeEndOperators =
  | QueryOperator.LESS_THAN
  | QueryOperator.LESS_THAN_OR_EQUAL;

type AvailableBooleanOperators = QueryOperator.EQUALS;

export type QueryStringType = {
  key: string;
  type: QueryType.STRING;
  operator: AvailableStringOperators;
  value: string;
};

export type QueryMultiStringType = {
  key: string;
  type: QueryType.MULTI_STRING;
  operator: AvailableMultiOperators;
  value: string[];
};

export type QueryRangeType = {
  key: string;
  type: QueryType.RANGE;
  value: {
    min?: {
      value: number;
      operator: AvailableRangeStartOperators;
    };
    max?: {
      value: number;
      operator: AvailableRangeEndOperators;
    };
  };
};

export type QueryBooleanType = {
  key: string;
  type: QueryType.BOOLEAN;
  operator: AvailableBooleanOperators;
  value: boolean;
};

export type QueryUnitType = {
  key: string;
  type: QueryType.UNIT;
  value: {
    quantity: {
      min?: {
        value: number;
        operator: AvailableRangeStartOperators;
      };
      max?: {
        value: number;
        operator: AvailableRangeEndOperators;
      };
    };
    unit: {
      value: string;
      operator: AvailableStringOperators;
    };
  };
};

export type QueryNullType = {
  key: string;
  type: undefined;
  operator: undefined;
  value: null;
};

export type QueryValue =
  | QueryStringType
  | QueryMultiStringType
  | QueryRangeType
  | QueryBooleanType
  | QueryNullType
  | QueryUnitType;

export type SearchParams = {
  [key: string]: string | string[] | undefined;
};
