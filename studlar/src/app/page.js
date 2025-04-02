"use client";

import styles from "../app/home.module.css";

import "./index.css";
import { useEffect, useState } from "react";

export default function Home() {
    const [error, setError] = useState("");
    const [board, setBoard] = useState(null);

    const handleLoading = async () => {
        try {
            const respone = await fetch(
                "http://localhost:8000/api/users/1/boards/"
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
        handleLoading();
    }, []);

    useEffect(() => {
        if (board) {
            window.requestAnimationFrame(() => {});
        }
    }, [board]);

    const displayTasklist = (board) => {
        return board.task_lists.map((tasklist) => {
            return (
                <div className="todolist-task" key={tasklist.id} draggable="true">
                    <span className="material-icons">radio_button_unchecked</span>
                    <p>{tasklist.name}</p>
                    <span className={`material-icons ${styles.dragIcon}`}>drag_indicator</span>
                </div>
            );
        });
    };

    const displayBoards = () => {
        return board.map((board) => {
            return (
                <article key={board.id}>
                    <div className="card-header">
                        <p>{board.name}</p>
                        <span className="material-icons card-header-menu">
                            menu
                        </span>
                    </div>
                    <p>{board.description}</p>
                    {displayTasklist(board)}
                    <div className="todolist-task">
                        <p>
                            <strong>+ Ajouter un item</strong>
                        </p>
                    </div>
                </article>
            );
        });
    };

    return (
        <section className="content">
            <div className="content-row">
                {error && (
                    <article>
                        <h1>
                            Error trying to load the dashboard. Please try again
                            later.
                        </h1>
                        <p className={styles.errorHeader}>{error}</p>
                    </article>
                )}
                <article>
                    <div className="card-header">
                        <p>Welcome to Studlar</p>
                        <span className="material-icons card-header-menu">
                            menu
                        </span>
                    </div>
                    <p>
                        Studlar is a platform to help student organize and plans
                        their calendars.
                    </p>
                    <p>Join today and get productive!</p>
                </article>

                {board && displayBoards()}
            </div>

            <div className="content-row">
                <article id="calendar">
                    <div className="card-header">
                        <p>Calendar</p>
                        <span className="material-icons card-header-menu">
                            menu
                        </span>
                    </div>
                    <div id="calendar-days"></div>
                </article>
            </div>
        </section>
    );
}
