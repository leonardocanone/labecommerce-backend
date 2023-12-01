import { TProduct, TUser } from "./types";

export function createUser(id: string, name: string, email: string, password: string): string {
  const newUser: TUser = {
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  
  return "Cadastro realizado com sucesso!"
}


export function createProduct(id: string, name: string, price: number, description: string, imageUrl: string): string {
  const newProduct: TProduct = {
    id,
    name,
    price,
    description,
    imageUrl
  };
  
  products.push(newProduct);
  
  return "Produto criado com sucesso!"
}


export function getAllUsers(): TUser[] {
   return users
}

export function getAllProducts(): TProduct[] {
  return products
}

export function searchProductsByName(products: TProduct[], name: string): TProduct[] {
  
  const searchTerm = name.toLowerCase();
  const results = products.filter (
  (product: TProduct) => {
    return product.name.toLowerCase().includes(searchTerm)
  });

  return results;
}

export function searchProductsByName2(name: string): TProduct[] {
  
  return products.filter((product: TProduct) => {
      return product.name.toLowerCase().includes(name.toLowerCase())
    }
  )
}


export const users: TUser[] = [
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


export const products: TProduct[] = [
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