import { useState } from "react";
import axios from "axios";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            alert(res.data.message);

            window.location.href = "/";

        } catch (err) {

            console.log(err);

            alert("Login failed");

        }

    };

    return (

        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh"
        }}>

            <form
                onSubmit={handleLogin}
                style={{
                    border: "2px solid black",
                    padding: "40px",
                    borderRadius: "12px",
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    backgroundColor: "white"
                }}
            >

                <h1 style={{
                    textAlign: "center"
                }}>
                    Login
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={{
                        padding: "12px",
                        border: "2px solid black",
                        borderRadius: "8px"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={{
                        padding: "12px",
                        border: "2px solid black",
                        borderRadius: "8px"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: "12px",
                        border: "2px solid black",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Login
                </button>

            </form>

        </div>

    );

}

export default Login;