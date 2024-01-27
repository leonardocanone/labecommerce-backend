
import { products, users, createUser, getAllUsers, getAllProducts, createProduct, searchProductsByName, searchProductsByName2 } from "./database";

import express, { Request, Response} from 'express';
import cors from 'cors';
import { TProduct, TUser } from "./types";
import { db } from './database/knex'

// const app = express()

// app.use(express.json())
// app.use(cors())

// app.listen(3003, () => {
//     console.log("Servidor rodando na porta 3003")
// })

// app.get("/ping", (req: Request, res: Response) => {
//     res.send("Teste Projeto - Pong!")
// })

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Teste Projeto - Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// getAllUsers
// app.get("/users", (req: Request, res: Response) => {
//     res.send(users)
// })

app.get("/users", async (req: Request, res: Response) => {

  try {

    // res.send(users);

    // const allUsers = await db.raw(`
    //         SELECT * FROM users;
    //     `)
        
    // const allUsers = await db.select("*").from("users")

    const allUsers = await db("users")

        res.status(200).send(allUsers)

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

app.get("/products", async (req: Request, res: Response) => {

  try {
    // const nameToFind = req.query.name as string;

    // if (nameToFind) {
    //   const result: TProduct[] = products.filter((product) => {
    //     return product.name.toLowerCase().includes(nameToFind.toLowerCase());
    //   });

    //   res.send(result);
    // } if (nameToFind !== undefined) {
    //     res.status(404);
    //     throw new Error("Para fazer a busca por nome, você precisa digitar pelo menos um caractere.");
    // }
    
    // res.send(products);

    const nameToFind = req.query.name as string;
    
    if (nameToFind !== undefined) {
      if (nameToFind.length < 1) {
        res.status(404);
        throw new Error("Para fazer a busca por nome, você precisa digitar pelo menos um caractere.");
      }

        // const productsByName = await db.raw(`
        //   SELECT * FROM products
        //   WHERE name LIKE '%${nameToFind}%';
        // `) 

        const productsByName = await db('products')
        .select('*')
        .where('name', 'like', `%${nameToFind}%`);

        res.status(200).send(productsByName)   
    }

    if (nameToFind === undefined) {
      
      // const allProducts = await db.raw(`
      //     SELECT * FROM products;
      //   `) 

      // const allProducts = await db.select("*").from("products")

      const allProducts = await db("products")

        res.status(200).send(allProducts)
    }   

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

app.post("/users", async (req: Request, res: Response) => {

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

        // const idExists = users.find(user => user.id === id)

        // if(idExists){
        //     res.status(400)
        //     throw new Error("Já existe um usuário cadastrado com este 'id'.")
        // }

        const [ idExists ] = await db("users").where({id: id})
        
        if (idExists) {
            res.status(400)
            throw new Error("Já existe um usuário cadastrado com este 'id'.");
        }

        // const emailExists = users.find(user => user.email === email)

        // if(emailExists){
        //     res.status(400)
        //     throw new Error("Já existe um usuário cadastrado com este 'email'.")
        // }

        const [ emailExists ] = await db("users").where({email: email})
        
        if (emailExists) {
            res.status(400)
            throw new Error("Já existe um usuário cadastrado com este 'email'.");
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

      // const newUser: TUser = {
      //   id,
      //   name,
      //   email,
      //   password,
      //   createdAt: new Date().toISOString(),
      // };

      //   const idExistente = users.find(user => user.id === newUser.id)

      //   if(idExistente){
      //       res.status(400)
      //       throw new Error("Já existe um usuário cadastrado com este 'id'.")
      //   }

      //   const emailExistente = users.find(user => user.email === newUser.email)

      //   if(emailExistente){
      //       res.status(400)
      //       throw new Error("Já existe um usuário cadastrado com este 'email'.")
      //   }

      // users.push(newUser);

      const data = new Date().toISOString();

    //   await db.raw(`
    //   INSERT INTO users (id, name, email, password, created_at)
    //   VALUES ("${id}", "${name}", "${email}", "${password}", "${data}")
    // `)

      const newUser = {
          id: id,
          name: name,
          email: email,
          password: password,
          created_at: data
      }

      await db("users").insert(newUser)

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
app.post("/products", async (req: Request, res: Response) => {
	
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

    // const idExists = users.find(user => user.id === id)

    //     if(idExists){
    //         res.status(400)
    //         throw new Error("Já existe um usuário cadastrado com este 'id'.")
    //     }
    
    const [ idExists ] = await db("products").where({id: id})
        
        if (idExists) {
            res.status(400)
            throw new Error("Já existe um produto cadastrado com este 'id'.");
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

	// const newProduct: TProduct = {
	// 	id,
	// 	name,
	// 	price,
	// 	description,
  //   imageUrl
	// }

  //       const idExistente = products.find(product => product.id === newProduct.id)

  //       if(idExistente){
  //           res.status(400)
  //           throw new Error("Já existe um produto cadastrado com este 'id'.")
  //       }

	// products.push(newProduct)

    // await db.raw(`
    //   INSERT INTO products (id, name, price, description, imageUrl)
    //   VALUES ("${id}", "${name}", "${price}", "${description}", "${imageUrl}")
    // `)

    const newProduct = {
      id: id,
      name: name,
      price: price,
      description: description,
      imageUrl: imageUrl
  }

    await db("products").insert(newProduct)

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

app.delete('/users/:id', async (req: Request, res: Response) => {
    
    try {
      // const idToDelete: string = req.params.id;

      // const userIndex: number = users.findIndex((user) => {
      //   return user.id === idToDelete;
      // });      

      // if (userIndex >= 0) {
      //   users.splice(userIndex, 1);
      // } if (userIndex < 0) {
      //       res.status(404)
      //       throw new Error("Usuário não localizado. Nada foi removido.")
      // }

      const idToDelete: string = req.params.id;

      const [ user ] = await db("users").where({id: idToDelete})

        if (user){
            await db("users").del().where({id: idToDelete})
        } else {
            res.status(404)
            throw new Error("'id' do Usuário não encontrado. Nada foi removido.")
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
app.delete('/products/:id', async (req: Request, res: Response) => {
    
    try{
    // const idToDelete: string = req.params.id

    // const productIndex: number = products.findIndex((product) => {
    //     return product.id === idToDelete
    // })

    // if (productIndex < 0) {
    //   res.status(404)
    //   throw new Error("Produto não localizado. Nada foi removido.")
    // }

    // if (productIndex >= 0) {
    //     products.splice(productIndex, 1)
    // }
    
    const idToDelete: string = req.params.id

    const [ product ] = await db("products").where({id: idToDelete})

        if (product){
            await db("products").del().where({id: idToDelete})
        } else {
            res.status(404)
            throw new Error("'id' do Produto não encontrado. Nada foi removido.")
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
app.put('/products/:id', async (req: Request, res: Response) => {
    
    try{
    const idToEdit = req.params.id

    // const productExist = products.find((product) => {
    //   return product.id === idToEdit
    // })

    // if (productExist === undefined) {
    //   res.status(404)
    //   throw new Error("Produto não localizado. Nada foi alterado.")
    // }

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

    // const product = products.find((product) => product.id === idToEdit)

    // if (product) {

    //     product.id = newId || product.id
    //     product.name = newName || product.name
    //     // product.price = newPrice || product.price
    //     product.description = newDescription || product.description
    //     product.imageUrl = newImageUrl || product.imageUrl
        
    //     product.price = isNaN(Number(newPrice)) ? product.price : newPrice as number

    const [ product ] = await db("products").where({id: idToEdit})

        if (product) {

            const updatedProduct = {
                id: newId || product.id,
                name: newName || product.name,
                price: newPrice || product.price,
                description: newDescription || product.description,
                imageUrl: newImageUrl || product.imageUrl
            }

            await db("products").update(updatedProduct).where({id: idToEdit})

        } else {
            res.status(404)
            throw new Error("'id' do Produto não localizado. Nada foi alterado.")
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

// createNewPurchase
app.post("/purchases", async (req: Request, res: Response) => {
  
  try {
    const {id, buyer, products} = req.body

    if (!id || !buyer || !Array.isArray(products) || products.length === 0) {
      
      res.status(400)
      throw new Error('Dados incorretos ou insuficientes para gerar o pedido de compra!')
    }

    const [ userExists ] = await db("users").where({id: buyer})
        
        if (!userExists) {
            res.status(404)
            throw new Error("Usuário (buyer) não encontrado.");
        }

    const [ purchaseExists ] = await db("purchases").where({id: id})
        
        if (purchaseExists) {
            res.status(400)
            throw new Error("Já existe um pedido de compra (purchase) com este 'id'.");
        }

    const productIdExists = products.map((product) => product.id)
    // console.log("productIdExists",productIdExists);
    // console.log("products",products);
    
    const productsExists = await db("products").whereIn("id", productIdExists)
    // console.log("productsExists",productsExists);
    // console.log("productsExists.length",productsExists.length);
    // console.log("products.length",products.length);
    
    if (productsExists.length !== products.length) { 
        res.status(404)
        throw new Error("O 'id' de algum produto não foi encontrado.")
    }

    const total_price = products.reduce((total, product) => {
      // console.log("total",total);
      // console.log("product",product);
      
      const productExists = productsExists.find((prod) => prod.id === product.id)
      // console.log("productExists",productExists);
      
      return total + productExists.price * product.quantity
    }, 0)
    

    const date = new Date().toISOString()

    const newPurchase = {
      id,
      buyer,
      total_price,
      created_at: date,
    }

    await db("purchases").insert(newPurchase)

      products.map(async (product) => {
        await db("purchases_products").insert({
          purchase_id: id,
          product_id: product.id,
          quantity: product.quantity,
        })
      })

      res.status(201).send("Pedido realizado com sucesso.")

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


// getPurchaseById
app.get('/purchases/:id', async (req: Request, res: Response) => {
    
  try{
    const idToSearch: string = req.params.id;

    const [ idExists ] = await db("purchases").where({id: idToSearch})
        
        if (!idExists) {
            res.status(404)
            throw new Error("'id' do Pedido não encontrado.");
        }

    const [ purchase ] = await db("purchases")
        .select(
            "purchases.id AS purchaseId",
            "users.id AS buyerId",
            "users.name AS buyerName",
            "users.email AS buyerEmail",
            "purchases.total_price AS totalPrice",
            "purchases.created_at AS createdAt"
        )
        .innerJoin("users", "purchases.buyer", "=", "users.id")
        .where({"purchases.id": idToSearch});

    const purchaseProducts = await db
        .select(
          "products.id",
          "products.name",
          "products.price",
          "products.description",
          "products.imageUrl",
          "purchases_products.quantity"
        )
        .from("purchases_products")
        .join("products", "product_id", "=", "products.id")
        .where({"purchases_products.purchase_id": idToSearch});

    const result = {
      purchaseId: purchase.purchaseId,
      buyerId: purchase.buyerId,
      buyerName: purchase.buyerName,
      buyerEmail: purchase.buyerEmail,
      totalPrice: purchase.totalPrice,
      createdAt: purchase.createdAt,
      products: purchaseProducts 
    };

    res.status(200).send(result)

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


// deletePurchaseById
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    
  try{
  
  const idToDelete: string = req.params.id

  const [ purchase ] = await db("purchases").where({id: idToDelete})

      if (purchase){

          await db("purchases_products").del().where({purchase_id: idToDelete})

          await db("purchases").del().where({id: idToDelete})
      } else {
          res.status(404)
          throw new Error("'id' do Pedido (Purchase) não encontrado. Nada foi removido.")
      }

  res.status(200).send("Pedido cancelado com sucesso")

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


