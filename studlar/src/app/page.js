"use client";

import styles from "@//app/home.module.css";
import "./index.css";
import { useEffect, useState } from "react";
import CreateBoardModel from "@/components/Modal/CreateBoardModal";
import { useUser } from "@/contexts/UserContext";
import Board from "@/components/Boards/Board";
import Link from "next/link";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";

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
                return (
                    <Board
                        key={board.id}
                        board={board}
                        onDelete={requestRefresh}
                        onUpdate={requestRefresh}
                    ></Board>
                );
            });
    };

    const sensors = useSensors(useSensor(PointerSensor));

    // Gère le drag, mais sans mise à jour immédiate
    const handleDragOver = (event) => {
        const { active, over } = event;
        // Pas de mise à jour ici, on attend le drag complet pour mettre à jour
    };

    // Met à jour uniquement quand le drag est terminé (lors du release de la souris)
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        // S'il n'y a pas d'élément cible sous la souris, rien à faire
        if (!over) return;

        const activeBoard = board.find((b) => b.id === active.id);
        const overBoard = board.find((b) => b.id === over.id);

        if (!activeBoard || !overBoard) return;

        // Si les positions sont différentes, on met à jour la position
        if (activeBoard.positionX !== overBoard.positionX) {
            const updatedBoard = {
                ...activeBoard,
                positionX: overBoard.positionX,
            };

            // Mise à jour sur le serveur
            await fetch("/api/boards/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBoard),
            });

            // Rafraîchissement après l'update
            requestRefresh();
        }
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
                {board && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}  // L'update se fait uniquement ici
                    >
                        {Array.from({ length: 4 }, (_, index) => (
                            <div key={index} className={styles.contentCol}>
                                <SortableContext
                                    strategy={verticalListSortingStrategy}
                                    items={board.filter((item) => item.positionX === index)
                                        .map((item) => item.id)}
                                >
                                    {displayBoards(index)}
                                </SortableContext>
                            </div>
                        ))}
                    </DndContext>
                )}
                {error && (
                    <article>
                        <h1>
                            Error trying to load the dashboard. Please try again
                            later.
                        </h1>
                        <p className={styles.errorHeader}>{error}</p>
                    </article>
                )}
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
