"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

export default function Header() {
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