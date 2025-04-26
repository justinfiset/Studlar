"use client";

import styles from "@//app/home.module.css";
import { useEffect, useState } from "react";
import CreateBoardModel from "@/components/Modal/CreateBoardModal";
import { useUser } from "@/contexts/UserContext";
import Board from "@/components/Boards/Board";
import Link from "next/link";
import DeleteConfirmationModal from "@/components/Modal/DeleteConfirmationModal";

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
import AddBoardComponentModal from "@/components/Modal/AddBoardComponentModal";

export default function Home() {
    const [columns, setColumns] = useState([
        "col-1",
        "col-2",
        "col-3",
        "col-4",
    ]);

    const [pendingUpdates, setPendingUpdates] = useState(new Set());
    useEffect(() => {
        if (pendingUpdates.size > 0) {
            // Wait 2s without any changes before sending the data
            // This is to prevent multiple sending of the same or similar data
            const timer = setTimeout(() => {
                flushPendingUpdates();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [pendingUpdates]);

    const { user } = useUser();
    const [error, setError] = useState("");
    const [reload, setReload] = useState(false);
    const [boards, setBoards] = useState([]);

    const [forceRefresh, setForceRefresh] = useState(0);
    const refreshColumns = () => {
        setForceRefresh((prev) => prev + 1);
    };

    // Modals
    const [deleteConfirmModalShow, setDeleteConfirmModalShow] = useState(false);
    const [deleteConfirmationCallback, setDeleteConfirmationCallback] =
        useState(null);

    const [activeBoardId, setActiveBoardId] = useState(null);
    const [createModal, setCreateModal] = useState(false);
    const [addComponentModal, setAddComponentModal] = useState(false);

    const showAddboardComponent = (id) => {
        setActiveBoardId(id);
        setAddComponentModal(true);
    };

    // Dnd
    const [activeDragId, setActiveDragId] = useState(null);
    const [overColumn, setOverColumn] = useState(-1);

    const getUserBoards = async () => {
        try {
            const respone = await fetch(
                `/api/boards/dashboard?owner_id=${user.id}`,
            );
            const data = await respone.json();

            if (respone.ok) {
                const sortedData = data.sort(
                    (a, b) => a.positionY - b.positionY
                );
                setBoards(sortedData);
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

    const updateColYPosition = (xPosition) => {
        setBoards((prev) => {
            const col = prev.filter(
                (board) => board.positionX === xPosition
            );

            const updatedCol = col.map((board, index) => ({
                ...board, 
                positionY: index
            }));

            return [
                ...prev.filter((board) => board.positionX !== xPosition),
                ...updatedCol
            ]
        });
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
        if (!over) return; // If and only if, we have an over element

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

    const flushPendingUpdates = async () => {
        for (const id of pendingUpdates) {
            const board = boards.find((b) => b.id === id);
            console.log("Updating board: ", board);
            if (board) {
                try {
                    const response = await fetch("/api/boards/", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(board),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        // Nothing for the moment
                        // TODO:
                        // Would be great to add a sucess icon somewhere and a sync / clour logo
                    } else {
                        console.error("Error:", data);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        }

        setPendingUpdates(new Set());
    };

    const addPendingUpdate = (boardId) => {
        setPendingUpdates((prev) => new Set(prev).add(boardId));
    };

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

                    // Update the y postiion for the column (to update the api)
                    updateColYPosition(activeBoardCol);
                } else {
                    const oldRow = boards.filter(
                        (board) => board.positionX === activeBoardCol
                    );
                    const newRow = boards.filter(
                        (board) => board.positionX === overBoardCol
                    );
                    const [removedBoard] = oldRow.splice(activeBoardIndex, 1);
                    removedBoard.positionX = overBoardCol;

                    newRow.splice(overBoardIndex + 1, 0, removedBoard);
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

                    // Update both columns
                    updateColYPosition(activeBoardCol);
                    updateColYPosition(overBoardCol);
                }

                addPendingUpdate(activeBoard.id);
                addPendingUpdate(overBoard.id);

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
                    const [removedBoard] = oldRow.splice(
                        getBoardColPos(activeBoard.id),
                        1
                    );

                    // Getting the last y postion of the new column and adding 1 to it
                    const oldNewCol = boards.filter(b => b.positionX == overCol);
                    console.log(oldNewCol);
                    removedBoard.positionY = oldNewCol.length > 0 ? oldNewCol[oldNewCol.length - 1].positionY + 1 : 0;

                    removedBoard.positionX = parseInt(overCol);

                    const newRow = boards.filter(
                        (board) => board.positionX === overCol
                    );
                    newRow.splice(0, 0, removedBoard);
                    setBoards((prev) => {
                        return prev
                            .filter(
                                (board) =>
                                    board.positionX !== activeBoardCol &&
                                    board.positionX !== overCol &&
                                    board.id !== activeBoard.id
                            )
                            .concat(oldRow)
                            .concat(newRow);
                    });

                    // Update both old and new col's boards y posiiton
                    updateColYPosition(activeBoardCol);
                    updateColYPosition(overCol);

                    refreshColumns();
                }

                addPendingUpdate(activeBoard.id);
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

            {deleteConfirmModalShow && (
                <DeleteConfirmationModal
                    onClose={() => setDeleteConfirmModalShow(false)}
                    onConfirm={() => {
                        if (deleteConfirmationCallback) {
                            deleteConfirmationCallback();
                        }
                        setDeleteConfirmModalShow(false);
                    }}
                />
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
                                    showAddboardComponent={
                                        showAddboardComponent
                                    }
                                    // Delete modal
                                    showDeleteModal={() => {
                                        setDeleteConfirmModalShow(true);
                                    }}
                                    deleteModalCallback={
                                        setDeleteConfirmationCallback
                                    }
                                />
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
            {addComponentModal && (
                <AddBoardComponentModal
                    id={activeBoardId}
                    onClose={() => setAddComponentModal(false)}
                />
            )}
        </>
    );
}
