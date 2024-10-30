import { FC, ReactNode } from "react";

import './style.scss';

interface ModalDelProps {
    title: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    children?: ReactNode;
}

export const ModalDel: FC<ModalDelProps> = ({ title, isOpen, onCancel, onConfirm, children} ) => {
    if (!isOpen) return null;

    return (
        <div className="modal-del">
            <div className="modal-del__content">
                <h2 className="modal-del__h2">{title}</h2>
                {children}
                <div className="modal-del__btn-wrapper">
                    <button className="modal-del__btn-cancel" onClick={onCancel}>Отмена</button>
                    <button className="modal-del__btn-del" onClick={onConfirm}>Подтвердить</button>
                </div>
            </div>
            <div className="modal__overlay" onClick={onCancel}></div>
        </div>
    )
}

