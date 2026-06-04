import { useEffect, useState } from "react";
import axios from "axios";

function Home() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

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

        axios.get("http://localhost:5000/products")
            .then((res) => {

                setProducts(res.data);

            })
            .catch((err) => {

                console.log(err);

            });

    }, []);

    const addToCart = async (productId) => {

        if (!user) {
            alert("Please login first");
            return;
        }

        try {

            await axios.post(
                "http://localhost:5000/add-to-cart",
                {
                    user_id: user.user_id,
                    product_id: productId,
                    quantity: 1
                }
            );

            alert("Product added to cart");

        } catch (err) {

            console.log(err);

            alert("Failed to add product");

        }

    };

    const filteredProducts = products.filter((product) => {

        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            category === "All" ||
            product.category_name === category;

        return matchesSearch && matchesCategory;

    });

    return (

        <div style={{
            padding: "20px"
        }}>

            <h1>Products</h1>

            <div style={{
                marginBottom: "20px",
                display: "flex",
                gap: "20px"
            }}>

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        width: "300px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        outline: "none",
                        fontSize: "16px"
                    }}
                />

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >

                    <option value="All">
                        All Categories
                    </option>

                    <option value="Clothing">
                        Clothing
                    </option>

                    <option value="Shoes">
                        Shoes
                    </option>

                    <option value="Jewellery">
                        Jewellery
                    </option>

                    <option value="Electronics">
                        Electronics
                    </option>

                </select>

            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px"
            }}>

                {filteredProducts.map((product) => (

                    <div
                        key={product.product_id}
                        style={{
                            border: "2px solid black",
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >

                        <div>

                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "15px"
                            }}>

                                <img
                                    src={`http://localhost:5000/${product.image_url}`}
                                    alt={product.name}
                                    style={{
                                        width: "220px",
                                        height: "220px",
                                        objectFit: "cover",
                                        borderRadius: "10px"
                                    }}
                                />

                            </div>

                            <h2 style={{
                                margin: "10px 0 5px"
                            }}>
                                {product.name}
                            </h2>

                            <p style={{
                                margin: "5px 0"
                            }}>
                                {product.description}
                            </p>

                            <p style={{
                                margin: "5px 0",
                                fontWeight: "bold"
                            }}>
                                ₹ {product.price}
                            </p>

                            <p style={{
                                margin: "5px 0"
                            }}>
                                Category: {product.category_name}
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                addToCart(product.product_id)
                            }
                            style={{
                                padding: "12px",
                                marginTop: "20px",
                                cursor: "pointer",
                                border: "2px solid black",
                                borderRadius: "8px",
                                backgroundColor: "white",
                                fontWeight: "bold",
                                width: "180px",
                                alignSelf: "center",
                                fontSize: "16px"
                            }}
                        >
                            Add To Cart
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default Home;