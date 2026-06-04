import { useState } from "react";
import axios from "axios";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/register",
                {
                    name,
                    email,
                    password
                }
            );

            alert(res.data.message);

            window.location.href = "/login";

        } catch (err) {

            console.log(err);

            alert("Registration failed");

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
                onSubmit={handleRegister}
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
                    Register
                </h1>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    style={{
                        padding: "12px",
                        border: "2px solid black",
                        borderRadius: "8px"
                    }}
                />

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
                    Register
                </button>

            </form>

        </div>

    );

}

export default Register;