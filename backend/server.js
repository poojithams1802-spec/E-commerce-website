const express = require("express");
const cors = require("cors");
const db = require("./db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// HOME ROUTE

app.get("/", (req, res) => {
    res.send("Backend Running");
});


// GET PRODUCTS

app.get("/products", (req, res) => {

    const sql = `
        SELECT 
            p.product_id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.image_url,
            c.category_name

        FROM products p

        JOIN categories c
        ON p.category_id = c.category_id
    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).send(err);

        } else {

            res.json(result);

        }

    });

});


// REGISTER

app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, hashedPassword],
            (err, result) => {

                if (err) {

                    console.log(err);

                    return res.status(500).send(err);

                }

                const userId = result.insertId;

                const cartSql = `
                    INSERT INTO carts (user_id)
                    VALUES (?)
                `;

                db.query(cartSql, [userId], (cartErr) => {

                    if (cartErr) {

                        console.log(cartErr);

                        return res.status(500).send(cartErr);

                    }

                    res.json({
                        message: "User registered successfully"
                    });

                });

            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// LOGIN

app.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).send(err);

        }

        if (result.length === 0) {

            return res.status(401).json({
                message: "User not found"
            });

        }

        const user = result[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid password"
            });

        }

        const token = jwt.sign(
            {
                id: user.user_id,
                email: user.email
            },
            "SECRET_KEY",
            {
                expiresIn: "1d"
            }
        );

        res.json({
    message: "Login successful",
    token: token,
    user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
    }
});

    });

});


// ADD TO CART

app.post("/add-to-cart", (req, res) => {

    const { user_id, product_id, quantity } = req.body;

    const getCartSql = `
        SELECT cart_id
        FROM carts
        WHERE user_id = ?
    `;

    db.query(getCartSql, [user_id], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).send(err);

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        const cart_id = result[0].cart_id;

        const insertSql = `
            INSERT INTO cart_items
            (cart_id, product_id, quantity)
            VALUES (?, ?, ?)
        `;

        db.query(
            insertSql,
            [cart_id, product_id, quantity],
            (insertErr, insertResult) => {

                if (insertErr) {

                    console.log(insertErr);

                    return res.status(500).send(insertErr);

                }

                res.json({
                    message: "Product added to cart"
                });

            }
        );

    });

});


// GET CART ITEMS

app.get("/cart/:userId", (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            ci.cart_item_id,
            ci.quantity,
            p.product_id,
            p.name,
            p.price,
            p.image_url

        FROM cart_items ci

        JOIN carts c
        ON ci.cart_id = c.cart_id

        JOIN products p
        ON ci.product_id = p.product_id

        WHERE c.user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).send(err);

        }

        res.json(result);

    });

});


// REMOVE FROM CART

app.delete("/remove-from-cart/:cartItemId", (req, res) => {

    const cartItemId = req.params.cartItemId;

    const sql = `
        DELETE FROM cart_items
        WHERE cart_item_id = ?
    `;

    db.query(sql, [cartItemId], (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).send(err);

        }

        res.json({
            message: "Item removed from cart"
        });

    });

});


app.post("/create-order", (req, res) => {

    const { user_id } = req.body;

    const cartSql = `

    SELECT
        ci.cart_item_id,
        ci.product_id,
        ci.quantity,

        p.price

    FROM cart_items ci

    JOIN carts c
    ON ci.cart_id = c.cart_id

    JOIN products p
    ON ci.product_id = p.product_id

    WHERE c.user_id = ?

`;

    db.query(cartSql, [user_id], (err, cartItems) => {

        if (err) {

            console.log(err);

            return res.status(500).send(err);

        }

        if (cartItems.length === 0) {

            return res.json({
                message: "Cart is empty"
            });

        }

        let totalAmount = 0;

        cartItems.forEach((item) => {

            totalAmount +=
                item.price * item.quantity;

        });

        const orderSql = `

            INSERT INTO orders
            (
                user_id,
                total_amount,
                order_status
            )

            VALUES (?, ?, ?)

        `;

        db.query(

            orderSql,

            [
                user_id,
                totalAmount,
                "Placed"
            ],

            (err, orderResult) => {

                if (err) {

                    console.log(err);

                    return res.status(500).send(err);

                }

                const order_id =
                    orderResult.insertId;

                const orderItemsValues =
                    cartItems.map((item) => [

                        order_id,
                        item.product_id,
                        item.quantity,
                        item.price

                    ]);

                const orderItemsSql = `

                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        quantity,
                        price_at_purchase
                    )

                    VALUES ?

                `;

                db.query(

                    orderItemsSql,

                    [orderItemsValues],

                    (err) => {

                        if (err) {

                            console.log(err);

                            return res.status(500).send(err);

                        }

                        const clearCartSql = `

                            DELETE ci
                            FROM cart_items ci

                            JOIN carts c
                            ON ci.cart_id = c.cart_id

                            WHERE c.user_id = ?

                        `;

                        db.query(
                            clearCartSql,
                            [user_id]
                        );

                        res.json({
                            message:
                                "Order placed successfully"
                        });

                    }

                );

            }

        );

    });

});


app.get("/orders/:user_id", (req, res) => {

    const { user_id } = req.params;

    const sql = `

        SELECT

            oi.order_item_id,
            oi.quantity,

            p.name,
            p.price,
            p.image_url,

            o.total_amount,
            o.order_status,
            o.order_date

        FROM order_items oi

        JOIN orders o
        ON oi.order_id = o.order_id

        JOIN products p
        ON oi.product_id = p.product_id

        WHERE o.user_id = ?

        ORDER BY o.order_date DESC

    `;

    db.query(sql, [user_id], (err, result) => {

        if (err) {

            console.log(err);

            res.status(500).send(err);

        } else {

            res.json(result);

        }

    });

});


app.put("/update-cart-quantity", (req, res) => {

    const { cart_item_id, quantity } = req.body;

    const sql = `
        UPDATE cart_items
        SET quantity = ?
        WHERE cart_item_id = ?
    `;

    db.query(
        sql,
        [quantity, cart_item_id],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).send(err);

            }

            res.json({
                message: "Quantity updated"
            });

        }
    );

});
// SERVER

app.listen(5000, () => {
    console.log("Server running on port 5000");
});