import { Link } from "react-router-dom";

function Navbar() {

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

    const logout = () => {

        localStorage.removeItem("user");

        window.location.href = "/login";

    };

    return (

        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "#222",
            color: "white"
        }}>

            <h1 style={{
                color: "#FFD43B",
                margin: 0,
                fontSize: "42px",
                fontWeight: "bold",
                letterSpacing: "1px"
            }}>
                ShopEase
            </h1>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "25px"
            }}>

                <Link
                    to="/"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Home
                </Link>

                <Link
                    to="/cart"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Cart
                </Link>

                <Link
                    to="/orders"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    Orders
                </Link>

                {user ? (

                    <button
                        onClick={logout}
                        style={{
                            padding: "10px 16px",
                            border: "2px solid white",
                            borderRadius: "8px",
                            backgroundColor: "transparent",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Logout
                    </button>

                ) : (

                    <>

                        <Link
                            to="/login"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold"
                            }}
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            style={{
                                color: "white",
                                textDecoration: "none",
                                fontWeight: "bold"
                            }}
                        >
                            Register
                        </Link>

                    </>

                )}

            </div>

        </div>

    );

}

export default Navbar;