// @ts-ignore TS6133
import { expect, test } from "@jest/globals";

import * as z from "../index";

class Person {
  name: string;
  constructor(objParam: Person | Record<keyof Person, Person[keyof Person]>) {
    this.name = objParam.name;
  }
}

const schema = z.construct.instanceof(Person);

test("passing validations", () => {
  const Bob = new Person({ name: "Bob" });
  expect(() => schema.parse(Bob));
  expect(() => schema.parse({ name: "Alice" }));
  expect(() => schema.parse(new Person({ name: "Carol" })));
});

test("failing validations", () => {
  expect(() => schema.parse("John")).toThrow();
  expect(() => schema.parse(5)).toThrow();
  expect(() => schema.parse(true)).toThrow();
  expect(() => schema.parse(null)).toThrow();
  expect(() => schema.parse(undefined)).toThrow();
  expect(() => schema.parse([])).toThrow();
});
