// como funciona typescript

// string | number: tipado, indica que solo puede recibir string y numerico, caso contrario lo marca como error. Esto ayuda a reducir el 60% de los bugs
const username: string | number = 'frank';
const sum = (a: number, b: number) => {
  return a + b;
}
sum(1, 3);
 class Person {
  /*
  private age: number;
  private lastName: string;

  constructor(age: number, lastName: string) {
    this.age = age;
    this.lastName = lastName
  }
  */
 // la siguiente instruccion reemplaza lo programado anteriormente
  constructor(private age: number, public lastName: string) {}

 }

 const frank = new Person(15, 'Frank');

frank.age;
