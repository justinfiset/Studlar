"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@/contexts/UserContext";

import "./login.css";

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const { login } = useUser();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = document.getElementById("username");
        const password = document.getElementById("password");

        if(username.value.length < 1 || password.value.length < 1) {
            setError("Error: please fill all fields");
            return;
        }

        try {
            const respone = await fetch("/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: username.value,
                    password: password.value,
                }),
            });

            const data = await respone.json();

            if(respone.ok) {
                login(data);
                router.push("/");
            } else {
                setError("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error: " + error.message);
        }
    }

    return (
        <section className="content">
            <div className="content-row">
                <article>
                    <div className="card-header">
                        <p>Login</p>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <form method="POST">
                        <label>Username : </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="AlbertEinstein1234@gmail.com"
                            required
                        />
                        <label>Password : </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="E=mc^2"
                            required
                        />
                        <button onClick={handleSubmit}>Login</button>
                    </form>
                </article>
            </div>
        </section>
    );
}
