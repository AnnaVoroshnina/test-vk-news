import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListItemNews } from './listItemNews.tsx';
import Store from '../../store/store.tsx';

// Создаем mock-объект для функций store
jest.mock('../../store/store.tsx', () => ({
    __esModule: true,
    default: {
        editItem: jest.fn(), // Mock для функции editItem
        deleteItem: jest.fn(), // Mock для функции deleteItem
    },
}));

// Определение типа props для ListItemNews
type ListItemNewsProps = {
    imageUrl: string;
    title: string;
    published: string;
    author: string;
    id: string;
};

describe('Компонент ListItemNews', () => {
    const props: ListItemNewsProps = {
        imageUrl: 'test-image.jpg',
        title: 'Тестовый заголовок новости',
        published: '2023-11-20T10:00:00.000Z',
        author: 'Тестовый автор',
        id: 'test-id',
    };

    it('Корректный рендер ListItemNews', () => {
        render(<ListItemNews {...props} />);

        // Проверяем, что элементы отображаются с правильным содержимым
        expect(screen.getByRole('img', { name: /фото новости/i })).toHaveAttribute('src', props.imageUrl);
        expect(screen.getByText(props.title)).toBeInTheDocument();
        expect(screen.getByText(/by Тестовый автор/i)).toBeInTheDocument(); // Проверяем автора и отформатированное время
    });

    it('Обработка клика по кнопке "Редактировать"', () => {
        render(<ListItemNews {...props} />);

        // Кликаем по кнопке "Редактировать"
        fireEvent.click(screen.getByRole('button', { name: /редактировать/i }));

        // Проверяем, что поле ввода для редактирования отображается и имеет правильное значение
        const editInput = screen.getByRole('textbox');
        expect(editInput).toBeVisible();
        expect(editInput).toHaveValue(props.title);
    });

    it('Обработка клика по кнопке "Сохранить"', () => {
        render(<ListItemNews {...props} />);

        // Кликаем по кнопке "Редактировать"
        fireEvent.click(screen.getByRole('button', { name: /редактировать/i }));

        // Изменяем значение в поле ввода
        const editInput = screen.getByRole('textbox');
        fireEvent.change(editInput, { target: { value: 'Измененный заголовок' } });

        // Кликаем по кнопке "Сохранить"
        fireEvent.click(screen.getByRole('button', { name: /сохранить/i }));

        // Проверяем, что функция editItem из store вызвана с правильными аргументами
        expect(Store.editItem).toHaveBeenCalledWith(props.id, 'Измененный заголовок');
    });

    it('Обработка клика по кнопке "Удалить"', () => {
        render(<ListItemNews {...props} />);

        // Кликаем по кнопке "Удалить"
        fireEvent.click(screen.getByRole('button', { name: /удалить/i }));

        // Проверяем, что функция deleteItem из store вызвана с правильным id
        expect(Store.deleteItem).toHaveBeenCalledWith(props.id);
    });

    it('Отображаем placeholder, если imageUrl не предоставлен', () => {
        const propsWithoutImage = { ...props, imageUrl: '' };
        render(<ListItemNews {...propsWithoutImage} />);

        // Проверяем, что placeholder-изображение отображается с правильным src
        const placeholderImage = screen.getByRole('img', { name: /нет фото новости/i });
        expect(placeholderImage).toHaveAttribute('src', 'https://mart812.ru/files/products/nofoto_9.800x600.jpg');
    });
});
