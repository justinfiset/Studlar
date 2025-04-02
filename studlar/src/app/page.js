import Image from "next/image";

import "./index.css";
import { useEffect, useState } from "react";

export default function Home() {
    const [error, setError] = useState("");
    const [board, setBoard ] = useState(null);

    const handleLoading = async (event) => {
        try {
            const respone = await fetch("http://localhost:8000/api/boards/?owner_id=1", {
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
                setBoard(data);
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
                <article id="todolist">
                    <div className="card-header">
                        <p>To Do List</p>
                        <span className="material-icons card-header-menu">
                            menu
                        </span>
                    </div>
                    <div className="todolist-task" draggable="true">
                        <span className="material-icons">
                            radio_button_unchecked
                        </span>
                        <p>Faire le layout du site</p>
                        <span className="material-icons">drag_indicator</span>
                    </div>
                    <div className="todolist-task" draggable="true">
                        <span className="material-icons">
                            radio_button_unchecked
                        </span>
                        <p>Faire le layout du site</p>
                        <span className="material-icons">drag_indicator</span>
                    </div>
                    <div className="todolist-task" draggable="true">
                        <span className="material-icons">
                            radio_button_unchecked
                        </span>
                        <p>Faire le layout du site</p>
                        <span className="material-icons">drag_indicator</span>
                    </div>
                    <div className="todolist-task" draggable="true">
                        <span className="material-icons">
                            radio_button_unchecked
                        </span>
                        <p>Faire le layout du site</p>
                        <span className="material-icons">drag_indicator</span>
                    </div>
                    <div className="todolist-task">
                        <p>
                            <strong>+ Ajouter un item</strong>
                        </p>
                    </div>
                </article>
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
                <article>

                </article>
            </div>
        </section>
    );
}
