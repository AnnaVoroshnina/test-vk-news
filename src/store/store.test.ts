import {act} from '@testing-library/react';
import Store from './store';
import {INews} from '../types/types';

// Создаем моковые данные для новостей
const mockNews: INews[] = [
    {
        "id": "ef032c8c-b09f-45c3-829c-a24c12bfb602",
        "title": "News Title 1",
        "description": "News Description 1",
        "url": "https://example.com/news/1",
        "author": "John Doe",
        "image": "https://example.com/news/1.jpg",
        "language": "en",
        "category": ["lifestyle"],
        "published": "2023-11-20T10:00:00Z"
    },
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "News Title 2",
        "description": "News Description 2",
        "url": "https://example.com/news/2",
        "author": "Jane Smith",
        "image": "https://example.com/news/2.jpg",
        "language": "en",
        "category": ["regional"],
        "published": "2023-11-20T12:00:00Z"
    }
];

// Создаем моковые данные для категорий новостей
const mockCategories = ["general", "technology", "business", "entertainment", "sports", "science", "health"];

// Описываем набор тестов для стора
describe('Store', () => {
    // Функция, которая выполняется перед каждым тестом
    beforeEach(() => {
        // Мокируем fetch перед каждым тестом
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({news: mockNews, categories: mockCategories}),
            })
        ) as jest.Mock;
    });

    // Функция, которая выполняется после каждого теста
    afterEach(() => {
        // Очищаем мок после каждого теста
        jest.restoreAllMocks();
        Store.news = [];
        Store.categories = [];
        Store.isLoading = false;
        Store.currentPage = 1;
        Store.deletedNewsIds = [];
        Store.error = null;
    });

    // Тест для метода fetchItems
    it('Получение новостей', async () => {
        // Проверяем начальное состояние
        expect(Store.isLoading).toBe(false);
        expect(Store.currentPage).toBe(1);

        // Вызываем метод fetchItems внутри act, чтобы обновить состояние React-компонентов
        await act(async () => {
            await Store.fetchItems();
        });

        // Проверяем состояние после загрузки
        expect(Store.news).toEqual(mockNews); // Проверяем, что новости загружены корректно
        expect(Store.isLoading).toBe(false); // Проверяем, что загрузка завершена
        expect(Store.currentPage).toBe(2); // Проверяем, что номер страницы увеличился

        // Проверяем, что дубликаты не добавляются
        await act(async () => {
            await Store.fetchItems();
        });
        expect(Store.news).toEqual(mockNews); // Длина массива не должна измениться

        // Проверяем, что удаленные новости не добавляются
        const idToDelete = mockNews[0].id; // Получаем id первой новости для удаления
        act(() => {
            Store.deleteItem(idToDelete); // Удаляем новость
        });
        await act(async () => {
            await Store.fetchItems(); // Загружаем новости снова
        });
        expect(Store.news.some(item => item.id === idToDelete)).toBe(false); // Проверяем, что удаленная новость не добавлена
    });

    it('Метод fetchCategories', async () => {
        // Вызываем метод fetchCategories
        await act(async () => {
            await Store.fetchCategories();
        });
        // Проверяем, что категории загружены корректно
        expect(Store.categories).toEqual(mockCategories);
    });

    it('Обработка ошибок в методе fetchItems', async () => {
        // Мокируем fetch для возврата ошибки
        global.fetch = jest.fn(() => Promise.reject("Ошибка при загрузке новостей")) as jest.Mock;

        // Вызываем метод fetchItems внутри act
        await act(async () => {
            await Store.fetchItems();
        });

        // Проверяем, что ошибка обработана корректно
        expect(Store.error).toBe('Ошибка при загрузке новостей');
        expect(Store.isLoading).toBe(false); // Проверяем, что загрузка завершена
    });

    it('Метод editItem', () => {
        // Заполняем стор моковыми данными
        Store.news = [...mockNews];

        // Задаем новый заголовок для первой новости
        const updatedTitle = 'Updated Title';
        act(() => {
            Store.editItem(mockNews[0].id, updatedTitle);
        });
        // Проверяем, что заголовок новости изменен
        expect(Store.news[0].title).toBe(updatedTitle);
    });

    // Тест для метода deleteItem
    it('Метод deleteItem', () => {
        // Заполняем стор моковыми данными
        Store.news = [...mockNews];
        // Получаем id первой новости для удаления
        const idToDelete = mockNews[0].id;

        // Вызываем метод deleteItem
        act(() => {
            Store.deleteItem(idToDelete);
        });

        // Проверяем, что новость удалена
        expect(Store.news.length).toBe(1);
        expect(Store.news.some(item => item.id === idToDelete)).toBe(false);
        // Проверяем, что id удаленной новости добавлен в deletedNewsIds
        expect(Store.deletedNewsIds).toContain(idToDelete);

        // Проверяем, что удаленная новость не загружается снова
        act(() => {
            Store.fetchItems();
        });

        // Проверяем, что новость не появилась после повторной загрузки
        expect(Store.news.length).toBe(1);
        expect(Store.news.some(item => item.id === idToDelete)).toBe(false);
    });
});
