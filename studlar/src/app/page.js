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
import BoardColumn from "@/components/Boards/BoardColumn";

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
                //console.log(data);
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

    const handleDragOver = (event) => {
        const { active, over } = event;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;
        const targetPositionX = over.id

        if (targetPositionX !== undefined) {
            const activeBoard = board.find((b) => b.id === active.id);
            if (!activeBoard) return;

            if (activeBoard.positionX !== Number(targetPositionX)) {
                const updatedBoard = {
                    ...activeBoard,
                    positionX: Number(targetPositionX),
                };

                await fetch("/api/boards/", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedBoard),
                });

                requestRefresh();
            }
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
                        onDragEnd={handleDragEnd}
                    >
                        {Array.from({ length: 4 }, (_, index) => (
                            // <div key={index} data-mon-id-test={index}>
                            //     <SortableContext
                            //         strategy={verticalListSortingStrategy}
                            //         items={board
                            //             .filter((item) => item.positionX === index)
                            //             .map((item) => item.id)}
                            //     >
                            //         {displayBoards(index)}
                            //         {board.filter(
                            //             (item) => item.positionX === index
                            //         ).length === 0 && (
                            //             <div className={styles.emptyColumn}>
                            //                 <p>No board here.</p>
                            //             </div>
                            //         )}
                            //     </SortableContext>
                            // </div>
                            <BoardColumn column={index} key={index}>
                                {displayBoards(index)}
                            </BoardColumn>
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
