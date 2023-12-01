"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.products = exports.users = exports.searchProductsByName2 = exports.searchProductsByName = exports.getAllProducts = exports.getAllUsers = exports.createProduct = exports.createUser = void 0;
function createUser(id, name, email, password) {
    const newUser = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
    };
    exports.users.push(newUser);
    return "Cadastro realizado com sucesso!";
}
exports.createUser = createUser;
function createProduct(id, name, price, description, imageUrl) {
    const newProduct = {
        id,
        name,
        price,
        description,
        imageUrl
    };
    exports.products.push(newProduct);
    return "Produto criado com sucesso!";
}
exports.createProduct = createProduct;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function searchProductsByName(products, name) {
    const searchTerm = name.toLowerCase();
    const results = products.filter((product) => {
        return product.name.toLowerCase().includes(searchTerm);
    });
    return results;
}
exports.searchProductsByName = searchProductsByName;
function searchProductsByName2(name) {
    return exports.products.filter((product) => {
        return product.name.toLowerCase().includes(name.toLowerCase());
    });
}
exports.searchProductsByName2 = searchProductsByName2;
exports.users = [
    {
        id: "u001",
        name: "Leonardo Palestra",
        email: "leo@email.com",
        password: "leo123",
        createdAt: new Date().toISOString(),
    },
    {
        id: "u002",
        name: "Vincenzo di Napoli",
        email: "vincenzo@email.com",
        password: "vince123",
        createdAt: new Date().toISOString(),
    },
];
exports.products = [
    {
        id: "prod001",
        name: "Mouse gamer",
        price: 250,
        description: "Melhor mouse do mercado!",
        imageUrl: "https://picsum.photos/seed/Mouse%20gamer/400",
    },
    {
        id: "prod002",
        name: "Monitor",
        price: 900,
        description: "Monitor LED Full HD 24 polegadas",
        imageUrl: "https://picsum.photos/seed/Monitor/400",
    },
];
