import {
  TypeObject,
  TypeArray,
  TypeNull,
  TypeBoolean,
  TypeNumber,
  TypeString,
} from "./constants";

type JSONArray = JSONValue[];
type JSONObject = { [key: string]: JSONValue };
type JSONValue = JSONObject | JSONArray | string | number | boolean | null;

type ObjectType = typeof TypeObject;
type ArrayType = typeof TypeArray;
type NullType = typeof TypeNull;
type BooleanType = typeof TypeBoolean;
type NumberType = typeof TypeNumber;
type StringType = typeof TypeString;

type SimpleType = NullType | BooleanType | NumberType | StringType;
type ComplexType = ObjectType | ArrayType;

type NodeType = SimpleType | ComplexType;

type NodeMatcher = (node: TreeNode) => boolean;
type NodeHandler = (node: TreeNode) => void;

interface TreeNode {
  type: NodeType;
  el: HTMLElement;
  parent?: TreeNode;
  childNodes?: TreeNode[];
  isComplex?: boolean;
  mark?: () => void;
  unmark?: () => void;
  expand?: (isRecursive: boolean) => void;
  collapse?: (isRecursive: boolean) => void;
  expandParent: (isRecursive: boolean) => void;
  getJSONPath: (isInDotNotation: boolean) => string;
  findChildren?: (
    matcher: NodeMatcher,
    handler: NodeHandler,
    isRecursive: boolean
  ) => void;
}

export type {
  ObjectType,
  ArrayType,
  BooleanType,
  NodeType,
  NullType,
  NumberType,
  StringType,
};

export type {
  JSONArray,
  JSONObject,
  JSONValue,
  NodeHandler,
  NodeMatcher,
  TreeNode,
};
