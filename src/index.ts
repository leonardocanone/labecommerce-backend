
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
app.get("/users", (req: Request, res: Response) => {
    res.send(users)
})

// getAllProducts - agora refatorada e que além de pegar/trazer todos os produtos, também está configurada para fazer o mesmo que o endpoint que fizemos abaixo, o findProductsByName.
app.get("/products", (req: Request, res: Response) => {
    
    const nameToFind = req.query.name as string;

    if(nameToFind){
        const result: TProduct[] = products.filter((product) => {
            return product.name.toLowerCase().includes(nameToFind.toLowerCase())
        })
        
        res.send(result)
    }

    res.send(products)
})

// findProductsByName
app.get("/products/search", (req: Request, res: Response) => {
    const nameToFind = req.query.name as string;

    const result: TProduct[] = products.filter((product) => {
        return product.name.toLowerCase().includes(nameToFind.toLowerCase())
    })
    
    res.send(result)
})

// createNewUser
app.post("/users", (req: Request, res: Response) => {
	const id = req.body.id as string
	const name = req.body.name as string
	const email = req.body.email as string
	const password = req.body.password as string
    // const createdAt = req.body.createdAt as string

	const newUser: TUser = {
		id,
		name,
		email,
		password,
        createdAt: new Date().toISOString()
	}

	users.push(newUser)

  res.status(201).send("Usuário cadastrado com sucesso!")
})

// createNewProduct
app.post("/products", (req: Request, res: Response) => {
	const id = req.body.id as string
	const name = req.body.name as string
	const price = req.body.price as number
	const description = req.body.description as string
    const imageUrl = req.body.imageUrl as string

	const newProduct: TProduct = {
		id,
		name,
		price,
		description,
        imageUrl
	}

	products.push(newProduct)

  res.status(201).send("Produto cadastrado com sucesso!")
})

// deleteUserById
app.delete('/users/:id', (req: Request, res: Response) => {
    
    const idToDelete = req.params.id

    const userIndex: number = users.findIndex((user) => {
        return user.id === idToDelete
    })

    if (userIndex >= 0) {
        users.splice(userIndex, 1)
    }

    res.status(200).send("Usuário removido com sucesso")
})

// deleteProductById
app.delete('/products/:id', (req: Request, res: Response) => {
    
    const idToDelete = req.params.id

    const productIndex: number = products.findIndex((product) => {
        return product.id === idToDelete
    })

    if (productIndex >= 0) {
        products.splice(productIndex, 1)
    }

    res.status(200).send("Produto removido com sucesso")
})

// editProductById
app.put('/products/:id', (req: Request, res: Response) => {
    
    const idToEdit = req.params.id

    const newId = req.body.id as string | undefined
    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newDescription = req.body.description as string | undefined
    const newImageUrl = req.body.imageUrl as string | undefined 

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
})



// console.log("Teste Exercício 1");

// console.log(users, products);

// console.log(createUser("u003", "Astrodev", "astrodev@email.com", "astrodev99"));
// console.log(getAllUsers());

// console.log(createProduct("prod003", "SSD gamer", 349.99, "Acelere seu sistema com velocidades incríveis de leitura e gravação.", "https://images.unsplash.com/photo"));
// console.log(getAllProducts());

// console.log(searchProductsByName(products, "gamer"));
// console.log(searchProductsByName2("gamer"));


