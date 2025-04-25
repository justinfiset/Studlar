"use client";

import "../../styles/normalize.css";
import "../../styles/global.css";
import Link from "next/link";
import { UserProvider, useUser } from "../contexts/UserContext";

function Header() {
    const { user } = useUser();

    return (
        <header>
            <nav>
                <Link href="/">Studlar</Link>
                {user ? (
                    <Link href="/account">{user.firstname}</Link>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </nav>
        </header>
    );
}

export default function RootLayout({ children }) {
    return (
        <UserProvider>
            <html lang="en" data-lt-installed="true">
                <head>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <link
                        href="https://fonts.googleapis.com/icon?family=Material+Icons"
                        rel="stylesheet"
                    />
                    <title>Studlar</title>
                </head>
                <body>
                    <Header />
                    <main>{children}</main>
                    <footer></footer>
                </body>
            </html>
        </UserProvider>
    );
}
