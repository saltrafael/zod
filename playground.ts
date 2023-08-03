import { z } from "./src";
import fetch from "node-fetch";

class Person {
  name: string;
  constructor(objParam: Person | Record<keyof Person, Person[keyof Person]>) {
    this.name = objParam.name;
  }
}

const Bob = new Person({ name: "Bob" });
console.log(z.construct.instanceof(Person).parse(Bob)); // passes
console.log(z.construct.instanceof(Person).parse({ name: "Alice" })); // passes
console.log(z.construct.instanceof(Person).safeParse("Carol")); // fails

// example use case

type ExcludeFunctions<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
  }[keyof T]
>;

type PokemonProperties = ExcludeFunctions<Pokemon>;

class Pokemon {
  weight: number;
  constructor(
    objParam:
      | Pokemon
      | Record<
          keyof PokemonProperties,
          PokemonProperties[keyof PokemonProperties]
        >
  ) {
    this.weight = objParam.weight as Pokemon["weight"];
  }
  compareWeight(other: Pokemon) {
    return this.weight > other.weight;
  }
}

(async () => {
  const pikachu = z.construct.instanceof(Pokemon).parse(
    await fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
      .then(async (res) => await res.json())
      .then(async (data) => await data)
  );
  const ditto = z.construct.instanceof(Pokemon).parse(
    await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
      .then(async (res) => await res.json())
      .then(async (data) => await data)
  );

  console.log("pikachu is heavier:", pikachu.compareWeight(ditto)); // true
})();
