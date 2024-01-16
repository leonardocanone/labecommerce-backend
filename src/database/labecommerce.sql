-- Active: 1702964219027@@127.0.0.1@3306

-- Criando as tabelas
CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

-- Deletar a tabela - deixei comentado para evitar de deletar. Caso precise deletar, basta descomentar os DROPs abaixo.
DROP TABLE users;
DROP TABLE products;


-- Visualizar a estrutura da tabela
PRAGMA table_info('users');
PRAGMA table_info('products');

-- Inserir valores na tabela
INSERT INTO users (id, name, email, password, created_at)
VALUES 
    ('u001', 'Usuário 001', 'usuario001@email.com', 'senha001', CURRENT_TIMESTAMP),
    ('u002', 'Usuário 002', 'usuario002@email.com', 'senha002', CURRENT_TIMESTAMP),
    ('u003', 'Usuário 003', 'usuario003@email.com', 'senha003', CURRENT_TIMESTAMP);

INSERT INTO products (id, name, price, description, image_url)
VALUES
    ('prod001', 'Mouse gamer', 100, 'Este é o Produto 001', 'colocar um link aqui'),
    ('prod002', 'Monitor gamer', 200, 'Este é o Produto 002', 'colocar um link aqui'),
    ('prod003', 'Teclado iluminado - RGB', 300, 'Este é o Produto 003', 'colocar um link aqui'); 

-- Visualizar todos os dados da tabela
SELECT * FROM users;
SELECT * FROM products;

-- Feedback Aprofundamento SQL - 21/12/2023
-- getAllUsers
SELECT * FROM users;

-- getAllProducts
SELECT * FROM products;

-- getAllProductsByName
SELECT * FROM products
WHERE name LIKE '%gamer%';

-- createUser
INSERT INTO users (id, name, email, password, created_at)
VALUES 
    ('u004', 'Usuário 004', 'usuario004@email.com', 'senha004', CURRENT_TIMESTAMP);

-- createProduct
INSERT INTO products (id, name, price, description, image_url)
VALUES
    ('prod004', 'Cooler para notebook', 90, 'Este é o Produto 004', 'colocar um link aqui');

-- deleteUserById
DELETE FROM users
WHERE id = 'u001'

-- deleteProductById
DELETE FROM products
WHERE id = 'prod003'

-- editProductById
UPDATE products 
SET 
    name = 'Cooler para notebook iluminado',
    price = 120,
    description = 'O Produto 004 foi editado',
    image_url = 'continua sem link'
WHERE id = 'prod004';

UPDATE users 
SET 
    id = 'u005'
WHERE id = 'u002';

-- Feedback Relações SQL 1

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    buyer TEXT NOT NULL,
    total_price REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(buyer) REFERENCES users(id)
        ON UPDATE CASCADE
		ON DELETE CASCADE
);

DROP TABLE purchases;

INSERT INTO purchases (id, buyer, total_price, created_at)
VALUES
    ('purch001', 'u002', 100, CURRENT_TIMESTAMP),
    ('purch002', 'u003', 300, CURRENT_TIMESTAMP),
    ('purch003', 'u004', 200, CURRENT_TIMESTAMP),
    ('purch004', 'u002', 90, CURRENT_TIMESTAMP);

SELECT * FROM purchases;

UPDATE purchases 
SET 
    total_price = 99.90
WHERE id = 'purch001';

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer = users.id;

SELECT
    purchases.id AS purchase_id,
    users.id AS buyer_id,
    users.name AS buyer_name,
    users.email AS email,
    purchases.total_price AS total_price,
    purchases.created_at AS created_at
FROM purchases
INNER JOIN users
ON purchases.buyer = users.id;


-- Feedback Relações SQL 2

CREATE TABLE purchases_products (
	purchase_id TEXT NOT NULL,
	product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
	FOREIGN KEY (purchase_id) REFERENCES purchases(id),
	FOREIGN KEY (product_id) REFERENCES products(id)
        ON UPDATE CASCADE
		ON DELETE CASCADE
);

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
	('purch001', 'prod004', 2),
    ('purch001', 'prod001', 6),
    ('purch002', 'prod003', 4),
	('purch003', 'prod002', 3),
    ('purch004', 'prod001', 5);

UPDATE purchases_products 
SET 
    quantity = 1
WHERE purchase_id = 'purch001' AND product_id = 'prod001';

SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id

SELECT
    purchases_products.purchase_id,
    purchases.buyer,
    users.name,
    purchases_products.product_id,
    products.name,
    products.price,
    purchases_products.quantity,
    products.price * purchases_products.quantity AS total_price,
    purchases.created_at
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id
INNER JOIN users
ON purchases.buyer = users.id


DROP TABLE purchases_products