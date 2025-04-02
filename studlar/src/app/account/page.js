"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from 'next/navigation';

export default function AccountPage(props) {
    const { user, logout } = useUser();

    return (
        <section className="content">
            <div className="content-row">
                <article>
                    <div className="card-header">
                        <p>Account Settings</p>
                    </div>
                    {
                        user ? (
                            <div className="account-info">
                                <p><strong>Firstname:</strong> {user.firstname}</p>
                                <p><strong>Lastname:</strong> {user.lastname}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        ) : (
                            <p>Please log in to view your account settings.</p>
                        )
                    }
                </article>
                <article>
                    <button onClick={logout} className="danger-button">Logout</button>
                </article>
            </div>
        </section>
    );
}