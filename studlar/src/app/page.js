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
    DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import BoardColumn from "@/components/Boards/BoardColumn";
import { ClientOnly } from "@/components/ClientOnly";

export default function Home() {
    const [columns, setColumns] = useState([
        "col-1",
        "col-2",
        "col-3",
        "col-4",
    ]);

    const { user } = useUser();
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);
    const [boards, setBoards] = useState([]);

    const [createModal, setCreateModal] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    const refreshColumns = () => {
        setForceRefresh((prev) => prev + 1);
    };

    // Dnd
    const [activeDragId, setActiveDragId] = useState(null);
    const [overColumn, setOverColumn] = useState(-1);

    const getUserBoards = async () => {
        try {
            const respone = await fetch(
                `http://localhost:8000/api/users/${user.id}/boards/`
            );
            const data = await respone.json();

            if (respone.ok) {
                setBoards(data);
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Start the drag after moving 5 pixels
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragId(event.active.id);
        setOverColumn(-1);
    };

    const handleDragMove = (event) => {
        const { active, over } = event;
        const overBoard = getBoard(over.id);
        setOverColumn(overBoard ? overBoard.positionX : -1);
    };

    const getBoardCol = (boardId) => {
        return boards.find((board) => board.id === boardId).positionX;
    };

    const getBoardColPos = (boardId) => {
        const posX = getBoardCol(boardId);
        return boards
            .filter((board) => board.positionX == posX)
            .findIndex((board) => board.id === boardId);
    };

    const getBoard = (boardId) =>
        boards.find((board) => board.id == boardId.split("-")[1]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setActiveDragId(null);

        if (active.id.toString().includes("board")) {
            // Board to board
            if (over.id.toString().includes("board")) {
                const activeBoard = getBoard(active.id);
                const overBoard = getBoard(over.id);
                if (!activeBoard || !overBoard) return;

                const activeBoardCol = getBoardCol(activeBoard.id);
                const overBoardCol = getBoardCol(overBoard.id);

                const activeBoardIndex = getBoardColPos(activeBoard.id);
                const overBoardIndex = getBoardColPos(overBoard.id);

                if (activeBoardCol === overBoardCol) {
                    let newBoardsCol = boards.filter(
                        (board) => board.positionX === overBoardCol
                    );
                    newBoardsCol = arrayMove(
                        newBoardsCol,
                        activeBoardIndex,
                        overBoardIndex
                    );

                    setBoards((prev) => {
                        return prev
                            .filter((board) => board.positionX !== overBoardCol)
                            .concat(newBoardsCol);
                    });
                    setOverColumn(-1);
                } else {
                    const oldRow = boards.filter(
                        (board) => board.positionX === activeBoardCol
                    );
                    const newRow = boards.filter(
                        (board) => board.positionX === overBoardCol
                    );
                    const [removedBoard] = oldRow.splice(activeBoardIndex, 1);
                    removedBoard.positionX = overBoardCol;

                    newRow.splice(overBoardIndex, 0, removedBoard);
                    setBoards((prev) => {
                        return prev
                            .filter(
                                (board) =>
                                    board.positionX !== activeBoardCol &&
                                    board.positionX !== overBoardCol
                            )
                            .concat(oldRow)
                            .concat(newRow);
                    });
                    setOverColumn(-1);
                }

                refreshColumns();
            }

            // Board to column
            if (over.id.toString().includes("col")) {
                const activeBoard = getBoard(active.id);
                if (!activeBoard) return;

                const activeBoardCol = getBoardCol(activeBoard.id);
                const overCol = over.id.split("-")[1];

                if (activeBoardCol != overCol) {
                    const oldRow = boards.filter(
                        (board) => board.positionX === activeBoardCol
                    );
                    const [removedBoard] = oldRow.splice(getBoardColPos(activeBoard.id), 1);
                    removedBoard.positionX = parseInt(overCol);
                    const newRow = boards.filter(
                        (board) => board.positionX === overBoardCol
                    );
                    newRoe.splice(newBoards.length - 1, 0, removedBoard);
                    setBoards((prev) => {
                        return prev
                            .filter(
                                (board) =>
                                    board.positionX !== activeBoardCol && board.positionX !== overCol
                            )
                            .concat(oldRow)
                            .concat(newRow);
                    });
                    refreshColumns();
                }
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
                {boards && (
                    <ClientOnly>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragEnd={handleDragEnd}
                            onDragMove={handleDragMove}
                            onDragStart={handleDragStart}
                            modifiers={[restrictToWindowEdges]}
                        >
                            {Array.from({ length: 4 }, (_, index) => (
                                <BoardColumn
                                    boards={boards.filter(
                                        (board) =>
                                            board && board.positionX === index
                                    )}
                                    column={index}
                                    key={`col-${index}-${forceRefresh}`}
                                    overColumn={overColumn}
                                    onUpdate={requestRefresh}
                                    onDelete={async (id) => {
                                        const newBoards = boards.filter(
                                            (board) => board.id !== id
                                        );
                                        setBoards(newBoards);
                                        refreshColumns();
                                    }}
                                ></BoardColumn>
                            ))}
                            <DragOverlay
                                style={{
                                    transition: "transform 0.02s",
                                }}
                            >
                                {activeDragId && (
                                    <Board
                                        board={getBoard(activeDragId)}
                                        onDelete={() => {}}
                                        onUpdate={() => {}}
                                    />
                                )}
                            </DragOverlay>
                        </DndContext>
                    </ClientOnly>
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
