"use client";

import { UserProvider } from "../contexts/UserContext";
import { ModalProvider } from "@/contexts/ModalContext";
import { useState, useEffect } from "react";

export default function Providers({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <UserProvider>
            <ModalProvider>{children}</ModalProvider>
        </UserProvider>
    );
}
