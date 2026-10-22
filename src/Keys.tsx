import { useState, KeyboardEvent } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    // Состояние со списком элементов, копируем пропсы, чтобы можно было редактировать
    const [items, setItems] = useState<IItem[]>(props.initialData);

    // ID элемента, который сейчас редактируется. null, если редактирования нет.
    const [editingId, setEditingId] = useState<number | null>(null);

    // Текст, который вводится в инпут
    const [inputValue, setInputValue] = useState<string>('');

    // Начало редактирования
    const handleStartEdit = (item: IItem) => {
        setEditingId(item.id);
        setInputValue(item.name);
    };

    // Обработка нажатия клавиш (Enter / Escape)
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
        if (e.key === 'Enter') {
            // Сохраняем изменения
            const updatedItems = items.map((item) =>
                item.id === id ? { ...item, name: inputValue } : item,
            );
            setItems(updatedItems);
            setEditingId(null); // выходим из режима редактирования
        } else if (e.key === 'Escape') {
            // Отменяем изменения
            setEditingId(null);
        }
    };

    // Сортировка копии массива, чтобы не мутировать исходный стейт
    const sortedItems = [...items].sort((a, b) => {
        return props.sorting === 'ASC' ? a.id - b.id : b.id - a.id;
    });

    return (
        <div>
            {sortedItems.map((item) => (
                // ВАЖНО: Используем item.id как key.
                // Если использовать index, при сортировке React перепутает инпуты.
                <div key={item.id} style={{ margin: '5px 0' }}>
                    {editingId === item.id ? (
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, item.id)}
                            autoFocus
                        />
                    ) : (
                        <span
                            onClick={() => handleStartEdit(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
