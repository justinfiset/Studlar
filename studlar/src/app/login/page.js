"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

import styles from "./login.module.css";

export default function LoginPage() {
    const [error, setError] = useState("");
    const router = useRouter();

    const { login } = useUser();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = document.getElementById("username");
        const password = document.getElementById("password");

        if (username.value.length < 1 || password.value.length < 1) {
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

            if (respone.ok) {
                login(data);
                router.push("/");
            } else {
                setError("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error: " + error.message);
        }
    };

    return (
        <section className={styles.content}>
            <article className={styles.card}>
                <div className="card-header">
                    <p>Login</p>
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <form className={styles.form}>
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
        </section>
    );
}
