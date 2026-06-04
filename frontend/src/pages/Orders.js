import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

    const [orders, setOrders] = useState([]);

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
            `http://localhost:5000/orders/${user.user_id}`
        )
            .then((res) => {

                setOrders(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

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
            padding: "30px"
        }}>

            <h1 style={{
                marginBottom: "30px"
            }}>
                Your Orders
            </h1>

            {orders.length === 0 ? (

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                    textAlign: "center"
                }}>

                    <h1 style={{
                        fontSize: "60px",
                        marginBottom: "15px"
                    }}>
                        📦
                    </h1>

                    <h2>
                        No orders yet
                    </h2>

                    <p style={{
                        color: "gray",
                        fontSize: "18px"
                    }}>
                        Start shopping and place your first order
                    </p>

                </div>

            ) : (

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}>

                    {orders.map((item) => (

                        <div
                            key={item.order_item_id}
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
                                    margin: 0
                                }}>
                                    Quantity: {item.quantity}
                                </p>

                                <p style={{
                                    margin: 0
                                }}>
                                    Price: ₹ {item.price}
                                </p>

                                <p style={{
                                    margin: 0,
                                    fontWeight: "bold"
                                }}>
                                    Total Order Amount:
                                    ₹ {item.total_amount}
                                </p>

                                <p style={{
                                    margin: 0
                                }}>
                                    Status: {item.order_status}
                                </p>

                                <p style={{
                                    margin: 0,
                                    color: "gray"
                                }}>
                                    Order Date:
                                    {" "}
                                    {new Date(
                                        item.order_date
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default Orders;