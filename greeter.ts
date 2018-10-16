function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User111";
//let user = [0, 1, 2, 3];

document.body.innerHTML = greeter(user);
