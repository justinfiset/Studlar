"use client";

import styles from "@//app/home.module.css";

import "./index.css";
import { useEffect, useState } from "react";
import CreateBoardModel from "@/components/Modal/CreateBoardModal";
import { useUser } from "@/contexts/UserContext";
import Board from "@/components/Boards/Board";
import Link from "next/link";

export default function Home() {
    const { user } = useUser();
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);
    const [board, setBoard] = useState(null);
    const [createModal, setCreateModal] = useState(false);

    const getUserBoards = async () => {
        try {
            const respone = await fetch(
                `http://localhost:8000/api/users/${user.id}/boards/`
            );
            const data = await respone.json();

            if (respone.ok) {
                setBoard(data);
                console.log(data);
            } else {
                setError("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Error: " + error.message);
        }
    };

    useEffect(() => {
        window.requestAnimationFrame(() => {});
        user && getUserBoards();
    }, [user]);

    useEffect(() => {
        if (user) {
            getUserBoards();
        }
    }, [reload]);

    const requestRefresh = () => {
        setReload(!reload);
    };

    const displayBoards = (column) => {
        return board
            .filter((board) => board.positionX == column)
            .map((board) => {
                return <Board key={board.id} board={board} onDelete={requestRefresh} onUpdate={requestRefresh}></Board>;
            });
    };

    return (
        <>
            {!user && (
                <div className={styles.disclamer}>
                    <p>Please log in to access your dashboard.</p>
                    <Link href="/login">Click here to login</Link>
                </div>
            )}

            <section className={styles.contentHolder}>
                <div className={styles.contentCol}>
                    {board && displayBoards(0)}
                </div>
                <div className={styles.contentCol}>
                    {board && displayBoards(1)}
                </div>
                <div className={styles.contentCol}>
                    {board && displayBoards(2)}
                </div>
                <div className={styles.contentCol}>
                    {board && displayBoards(3)}
                </div>
                {error && (
                    <article>
                        <h1>
                            Error trying to load the dashboard. Please try again
                            later.
                        </h1>
                        <p className={styles.errorHeader}>{error}</p>
                    </article>
                )}
                {/* <article>
                    <div className={styles.draggableHeader}></div>
                    <div className="card-header">
                        <p>Welcome to Studlar</p>
                    </div>
                    <p>
                        Studlar is a platform to help student organize and plans
                        their calendars.
                    </p>
                    <p>Join today and get productive!</p>
                </article> */}
            </section>
            <div className={styles.addBtn} onClick={() => setCreateModal(true)}>
                <span className="material-icons">add</span>
            </div>
            {createModal && (
                <CreateBoardModel
                    onClose={() => setCreateModal(false)}
                    onCreate={requestRefresh}
                />
            )}
        </>
    );
}
