import { FC, useState } from "react";
import { ITask } from "../../../types/interfaces";

interface ModalEditProps {
    title: string;
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: (updatedTask: Partial<ITask>) => void; 
    task: ITask;
}

export const ModalEdit: FC<ModalEditProps> = ({ title, isOpen, onCancel, onConfirm, task }) => {
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedPomodorosPlanned, setEditedPomodorosPlanned] = useState(task.pomodorosPlanned.toString());

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(e.target.value);
    };

    const handlePomodorosPlannedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedPomodorosPlanned(e.target.value);
    };

    const handleSave = () => {
        onConfirm({
            id: task.id, 
            title: editedTitle,
            pomodorosPlanned: parseInt(editedPomodorosPlanned),
            pomodorosCompleted: 0
        });
    };

    if (!isOpen) return null;

    return (
        <div className="edit">
            <h2 className="edit__h2">{title}</h2>
            <form className="edit__form" action="">
                <input 
                    className="edit__input"
                    type="text" 
                    name="title" 
                    id="title" 
                    value={editedTitle} 
                    onChange={handleTitleChange} 
                />
                <input 
                    className="edit__input"
                    type="text" 
                    name="pomodorosPlanned" 
                    id="pomodorosPlanned" 
                    value={editedPomodorosPlanned} 
                    onChange={handlePomodorosPlannedChange} 
                />
                <button  className="edit__btn-save" type="button" onClick={handleSave}>Сохранить</button>
                <button className="edit__btn-cancel" type="button" onClick={onCancel}>Отмена</button>
            </form>
        </div>
    );
};
