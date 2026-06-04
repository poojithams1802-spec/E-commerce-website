import { useEffect, useState } from "react";
import axios from "axios";

function Cart() {

    const [cartItems, setCartItems] = useState([]);

    let user = null;

try {

    const storedUser =
        localStorage.getItem("user");

    if (
        storedUser &&
        storedUser !== "undefined"
    ) {

        user = JSON.parse(storedUser);

    }

} catch (err) {

    console.log(err);

}

    useEffect(() => {

        if (!user) {
            return;
        }

        axios.get(
            `http://localhost:5000/cart/${user.user_id}`
        )
            .then((res) => {

                setCartItems(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, [user]);

    const placeOrder = async () => {

        try {

            await axios.post(
                "http://localhost:5000/create-order",
                {
                    user_id: user.user_id
                }
            );

            alert("Order placed successfully");

            window.location.reload();

        } catch (err) {

            console.log(err);

            alert("Order failed");

        }

    };

    const removeItem = async (cartItemId) => {

        try {

            await axios.delete(
                `http://localhost:5000/remove-from-cart/${cartItemId}`
            );

            setCartItems(
                cartItems.filter(
                    (item) =>
                        item.cart_item_id !== cartItemId
                )
            );

        } catch (err) {

            console.log(err);

            alert("Failed to remove item");

        }

    };

    const updateQuantity = async (
        cartItemId,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }

        try {

            await axios.put(
                "http://localhost:5000/update-cart-quantity",
                {
                    cart_item_id: cartItemId,
                    quantity: newQuantity
                }
            );

            setCartItems(

                cartItems.map((item) =>

                    item.cart_item_id === cartItemId
                        ? {
                            ...item,
                            quantity: newQuantity
                        }
                        : item

                )

            );

        } catch (err) {

            console.log(err);

        }

    };

    if (!user) {

        return (

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
                flexDirection: "column"
            }}>

                <h1>🔒</h1>

                <h2>Please login first</h2>

            </div>

        );

    }

    return (

        <div style={{
            padding: "20px"
        }}>

            <h1>Your Cart</h1>

            {cartItems.length > 0 && (

                <button
                    onClick={placeOrder}
                    style={{
                        padding: "12px 20px",
                        marginBottom: "20px",
                        cursor: "pointer",
                        border: "2px solid black",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        fontWeight: "bold"
                    }}
                >
                    Place Order
                </button>

            )}

            {cartItems.length === 0 ? (

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                    textAlign: "center"
                }}>

                    <h1 style={{
                        fontSize: "50px",
                        marginBottom: "10px"
                    }}>
                        🛒
                    </h1>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p style={{
                        color: "gray"
                    }}>
                        Add some products to continue shopping
                    </p>

                </div>

            ) : (

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>

                    {cartItems.map((item) => (

                        <div
                            key={item.cart_item_id}
                            style={{
                                border: "2px solid black",
                                borderRadius: "12px",
                                padding: "20px",
                                display: "flex",
                                gap: "25px",
                                alignItems: "center",
                                backgroundColor: "white"
                            }}
                        >

                            <img
                                src={`http://localhost:5000/${item.image_url}`}
                                alt={item.name}
                                style={{
                                    width: "180px",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                            />

                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px"
                            }}>

                                <h2 style={{
                                    margin: 0
                                }}>
                                    {item.name}
                                </h2>

                                <p style={{
                                    margin: 0,
                                    fontWeight: "bold"
                                }}>
                                    ₹ {item.price}
                                </p>

                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.cart_item_id,
                                                item.quantity - 1
                                            )
                                        }
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            border: "2px solid black",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        -
                                    </button>

                                    <p style={{
                                        margin: 0
                                    }}>
                                        Quantity: {item.quantity}
                                    </p>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.cart_item_id,
                                                item.quantity + 1
                                            )
                                        }
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            border: "2px solid black",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    onClick={() =>
                                        removeItem(item.cart_item_id)
                                    }
                                    style={{
                                        padding: "10px 16px",
                                        border: "2px solid black",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        backgroundColor: "white",
                                        fontWeight: "bold",
                                        width: "160px"
                                    }}
                                >
                                    Remove Item
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Cart;