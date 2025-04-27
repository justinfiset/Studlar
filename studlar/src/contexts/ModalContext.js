"use client";

import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modalConfig, setModalConfig] = useState({
        component: null,
        props: {},
        isOpen: false
    });

    const openModal = (component, props = {}) => {
        setModalConfig({
            component,
            props,
            isOpen: true
        });
    };

    const closeModal = () => {
        setModalConfig({
            component: null,
            props: {},
            isOpen: false
        });
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalConfig.isOpen && modalConfig.component && (
                <modalConfig.component 
                    {...modalConfig.props} 
                    onClose={closeModal}
                />
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};