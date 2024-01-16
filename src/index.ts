
import { products, users, createUser, getAllUsers, getAllProducts, createProduct, searchProductsByName, searchProductsByName2 } from "./database";

import express, { Request, Response} from 'express';
import cors from 'cors';
import { TProduct, TUser } from "./types";

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Teste Projeto - Pong!")
})

// getAllUsers
// app.get("/users", (req: Request, res: Response) => {
//     res.send(users)
// })

app.get("/users", (req: Request, res: Response) => {

  try {
    res.send(users);

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// getAllProducts - agora refatorada e que além de pegar/trazer todos os produtos, também está configurada para fazer o mesmo que o endpoint que fizemos abaixo, o findProductsByName.
// app.get("/products", (req: Request, res: Response) => {
    
//     const nameToFind = req.query.name as string;

//     if(nameToFind){
//         const result: TProduct[] = products.filter((product) => {
//             return product.name.toLowerCase().includes(nameToFind.toLowerCase())
//         })
        
//         res.send(result)
//     }

//     res.send(products)
// })

app.get("/products", (req: Request, res: Response) => {

  try {
    const nameToFind = req.query.name as string;

    if (nameToFind) {
      const result: TProduct[] = products.filter((product) => {
        return product.name.toLowerCase().includes(nameToFind.toLowerCase());
      });

      res.send(result);
    } if (nameToFind !== undefined) {
        res.status(404);
        throw new Error("Para fazer a busca por nome, você precisa digitar pelo menos um caractere.");
    }
    
    res.send(products);

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
});

// findProductsByName
app.get("/products/search", (req: Request, res: Response) => {
    const nameToFind = req.query.name as string;

    const result: TProduct[] = products.filter((product) => {
        return product.name.toLowerCase().includes(nameToFind.toLowerCase())
    })
    
    res.send(result)
})

// createNewUser
// app.post("/users", (req: Request, res: Response) => {
// 	const id = req.body.id as string
// 	const name = req.body.name as string
// 	const email = req.body.email as string
// 	const password = req.body.password as string
//     // const createdAt = req.body.createdAt as string

// 	const newUser: TUser = {
// 		id,
// 		name,
// 		email,
// 		password,
//         createdAt: new Date().toISOString()
// 	}

// 	users.push(newUser)

//   res.status(201).send("Usuário cadastrado com sucesso!")
// })

app.post("/users", (req: Request, res: Response) => {

    try {
      const id = req.body.id as string
      const name = req.body.name as string;
      const email = req.body.email as string;
      const password = req.body.password as string;
      // const createdAt = req.body.createdAt as string

      if (id === undefined || name === undefined || email === undefined || password === undefined) {
        res.status(400)
        throw new Error("Para criar um novo usuário você precisa informar 'id', 'name', 'email' e 'password'.")
      }

      if (id !== undefined) {
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser do tipo string.")
        }

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("'id' deve iniciar com a letra 'u'.")
        }

        if (typeof name !== "string") {
          res.status(400)
          throw new Error("'name' deve ser do tipo string.")
        }

        if (name.length < 2) {
          res.status(400)
          throw new Error("'name' deve ter pelo menos 2 caracteres.")
        }

        if (typeof email !== "string") {
          res.status(400)
          throw new Error("'email' deve ser do tipo string.")
        }

        if (typeof password !== "string") {
          res.status(400)
          throw new Error("'password' deve ser do tipo string.")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
          res.status(400)
          throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

    }

      const newUser: TUser = {
        id,
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

        const idExistente = users.find(user => user.id === newUser.id)

        if(idExistente){
            res.status(400)
            throw new Error("Já existe um usuário cadastrado com este 'id'.")
        }

        const emailExistente = users.find(user => user.email === newUser.email)

        if(emailExistente){
            res.status(400)
            throw new Error("Já existe um usuário cadastrado com este 'email'.")
        }

      users.push(newUser);

      res.status(201).send("Usuário cadastrado com sucesso!");

    } catch (error) {
      if (res.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado.");
      }
    }
})

// createNewProduct
app.post("/products", (req: Request, res: Response) => {
	
  try{
  // const id = req.body.id as string
	// const name = req.body.name as string
	// const price = req.body.price as number
	// const description = req.body.description as string
  // const imageUrl = req.body.imageUrl as string

  const { id, name, price, description, imageUrl } = req.body

  if (id === undefined || name === undefined || price === undefined || description === undefined || imageUrl === undefined) {
    res.status(400)
    throw new Error("Para criar um novo produto você precisa informar 'id', 'name', 'price', 'description' e 'imageUrl'.")
  }

  if (id !== undefined) {
    if (typeof id !== "string") {
        res.status(400)
        throw new Error("'id' deve ser do tipo string.")
    }

    if (!id.startsWith("prod")) {
        res.status(400)
        throw new Error("'id' deve iniciar com a abreviação 'prod' de produto.")
    }

    if (typeof name !== "string") {
      res.status(400)
      throw new Error("'name' deve ser do tipo string.")
    }

    if (name.length < 2) {
      res.status(400)
      throw new Error("'name' deve ter pelo menos 2 caracteres.")
    }

    if (typeof price !== "number") {
      res.status(400)
      throw new Error("'price' deve ser do tipo number.")
    }

    if (typeof description !== "string") {
      res.status(400)
      throw new Error("'description' deve ser do tipo string.")
    }

    if (typeof imageUrl !== "string") {
      res.status(400)
      throw new Error("'imageUrl' deve ser do tipo string.")
    }

}

	const newProduct: TProduct = {
		id,
		name,
		price,
		description,
    imageUrl
	}

        const idExistente = products.find(product => product.id === newProduct.id)

        if(idExistente){
            res.status(400)
            throw new Error("Já existe um produto cadastrado com este 'id'.")
        }

	products.push(newProduct)

  res.status(201).send("Produto cadastrado com sucesso!")

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }
})

// deleteUserById
// app.delete('/users/:id', (req: Request, res: Response) => {
    
//     const idToDelete = req.params.id

//     const userIndex: number = users.findIndex((user) => {
//         return user.id === idToDelete
//     })

//     if (userIndex >= 0) {
//         users.splice(userIndex, 1)
//     }

//     res.status(200).send("Usuário removido com sucesso")
// })

app.delete('/users/:id', (req: Request, res: Response) => {
    
    try {
      const idToDelete: string = req.params.id;

      const userIndex: number = users.findIndex((user) => {
        return user.id === idToDelete;
      });      

      if (userIndex >= 0) {
        users.splice(userIndex, 1);
      } if (userIndex < 0) {
            res.status(404)
            throw new Error("Usuário não localizado. Nada foi removido.")
      }

      res.status(200).send("Usuário removido com sucesso");

    } catch (error) {
      if (res.statusCode === 200) {
        res.status(500);
      }

      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado.");
      }
    }
    
})

// deleteProductById
app.delete('/products/:id', (req: Request, res: Response) => {
    
    try{
    const idToDelete: string = req.params.id

    const productIndex: number = products.findIndex((product) => {
        return product.id === idToDelete
    })

    if (productIndex < 0) {
      res.status(404)
      throw new Error("Produto não localizado. Nada foi removido.")
    }

    if (productIndex >= 0) {
        products.splice(productIndex, 1)
    } 

    res.status(200).send("Produto removido com sucesso")
  
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }

})

// editProductById
app.put('/products/:id', (req: Request, res: Response) => {
    
    try{
    const idToEdit = req.params.id

    const productExist = products.find((product) => {
      return product.id === idToEdit
    })

    if (productExist === undefined) {
      res.status(404)
      throw new Error("Produto não localizado. Nada foi alterado.")
    }

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImageUrl = req.body.imageUrl as string | undefined 

    if (newId !== undefined) {
      if (typeof newId !== "string") {
          res.status(400)
          throw new Error("'id' deve ser do tipo string.")
      }
    }

    if (newName !== undefined) {
      if (typeof newName !== "string") {
          res.status(400)
          throw new Error("'name' deve ser do tipo string.")
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
          res.status(400)
          throw new Error("'price' deve ser do tipo number.")
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
          res.status(400)
          throw new Error("'description' deve ser do tipo string.")
      }
    }

    if (newImageUrl !== undefined) {
      if (typeof newImageUrl !== "string") {
          res.status(400)
          throw new Error("'imageUrl' deve ser do tipo string.")
      }
    }

    const product = products.find((product) => product.id === idToEdit)

    if (product) {

        product.id = newId || product.id
        product.name = newName || product.name
        // product.price = newPrice || product.price
        product.description = newDescription || product.description
        product.imageUrl = newImageUrl || product.imageUrl
        
        product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number
}

res.status(200).send("Produto atualizado com sucesso")

  } catch (error) {
    if (res.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado.");
    }
  }

})



// console.log("Teste Exercício 1");

// console.log(users, products);

// console.log(createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99"));
// console.log(getAllUsers());

// console.log(createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://images.unsplash.com/photo"));
// console.log(getAllProducts());

// console.log(searchProductsByName(products, "gamer"));
// console.log(searchProductsByName2("gamer"));


