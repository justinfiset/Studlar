"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import styles from "./account.module.css";
import { useEffect, useState } from "react";

export default function AccountPage(props) {
    const { user, logout, setUser } = useUser();

    const [isediting, setIsEditing] = useState(false);
    const [userSettings, setUserSettings] = useState({});
    const [tempUserSettings, setTempUserSettings] = useState({});

    useEffect(() => {
        if (user) {
            setUserSettings({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
            });
        }
    }, [user]);

    useEffect(() => {
        setTempUserSettings(userSettings);
    }, [isediting, userSettings]);

    const handleSave = () => {
        setUserSettings(tempUserSettings);
        setIsEditing(false);

        setUser({
            ...user,
            firstname: tempUserSettings.firstname,
            lastname: tempUserSettings.lastname,
            email: tempUserSettings.email,
        });

        // Send data to the api
        fetch("/api/users", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user.id,
                firstname: tempUserSettings.firstname,
                lastname: tempUserSettings.lastname,
                email: tempUserSettings.email,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log("User settings updated successfully.");
                } else {
                    console.error("Error updating user settings:", data);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <section className={styles.contentHolder}>
            <div className="content-row">
                <article>
                    <div className="card-header">
                        <p>Account Settings</p>
                    </div>
                    {user ? (
                        <>
                            <div className="account-info">
                                {!isediting ? (
                                    <>
                                        <p>
                                            <strong>Firstname:</strong>{" "}
                                            {userSettings.firstname}
                                        </p>
                                        <p>
                                            <strong>Lastname:</strong>{" "}
                                            {userSettings.lastname}
                                        </p>
                                        <p>
                                            <strong>Email:</strong>{" "}
                                            {userSettings.email}
                                        </p>
                                    </>
                                ) : (
                                    <form className={styles.editForm}>
                                        <label htmlFor="firstname">
                                            <strong>Firstname:</strong>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstname"
                                            name="firstname"
                                            defaultValue={tempUserSettings.firstname}
                                            onChange={(e) => {
                                                setTempUserSettings({
                                                    ...tempUserSettings,
                                                    firstname: e.target.value,
                                                });
                                            }}
                                        />
                                        <br />
                                        <label htmlFor="lastname">
                                            <strong>Lastname:</strong>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastname"
                                            name="lastname"
                                            defaultValue={tempUserSettings.lastname}
                                            onChange={(e) => {
                                                setTempUserSettings({
                                                    ...tempUserSettings,
                                                    lastname: e.target.value,
                                                });
                                            }}
                                        />{" "}
                                        <br />
                                        <label htmlFor="email">
                                            <strong>Email:</strong>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            defaultValue={tempUserSettings.email}
                                            onChange={(e) => {
                                                setTempUserSettings({
                                                    ...tempUserSettings,
                                                    email: e.target.value,
                                                });
                                            }}
                                        />
                                    </form>
                                )}
                            </div>
                            <div className={styles.buttonSection}>
                                {isediting ? (
                                    <button
                                        onClick={() => {
                                            handleSave();
                                        }}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                                <button
                                    className={isediting ? "danger-button" : ""}
                                    onClick={() => {
                                        setIsEditing(!isediting);
                                    }}
                                >
                                    {isediting ? "Cancel" : "Edit"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Please log in to view your account settings.</p>
                    )}
                </article>
                <article>
                    <button onClick={logout} className="danger-button">
                        Logout
                    </button>
                </article>
            </div>
            <div className="content-row">
                <article>
                    <div className="card-header">
                        <p>Color theme</p>
                    </div>
                    <p>Change your color theme.</p>
                </article>
            </div>
        </section>
    );
}
