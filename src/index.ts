// console.log("Teste Exercício 1");

import { products, users, createUser, getAllUsers, getAllProducts, createProduct, searchProductsByName, searchProductsByName2 } from "./database";

// console.log(users, products);

// console.log(createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99"));
// console.log(getAllUsers());

console.log(createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://images.unsplash.com/photo"));
console.log(getAllProducts());

console.log(searchProductsByName(products, "gamer"));
console.log(searchProductsByName2("gamer"));


