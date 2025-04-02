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
                                <p>Firstname: {user.firstname}</p>
                                <p>Lastname: {user.lastname}</p>
                                <p>Email: {user.email}</p>
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