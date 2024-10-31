import React from 'react';
import {render, screen, waitFor, fireEvent, act} from '@testing-library/react';
import ListNews from './list';
import Store from '../../store/store';
import {INews, CategoriesType} from '../../types/types';

// Моковые данные для новостей
const mockNews: INews[] = [
    {
        "id": "1",
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
        "id": "2",
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

// Моковые данные для категорий
const mockCategories: CategoriesType[] = ["lifestyle", "technology", "business", "entertainment", "sports", "science", "health"];

describe('ListNews', () => {
    beforeEach(() => {
        // Мокируем методы Store перед каждым тестом
        Store.fetchCategories = jest.fn();
        Store.fetchItems = jest.fn();
        Store.news = [];
        Store.isLoading = false;
        Store.error = null;

        // Мокируем fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({news: mockNews, categories: mockCategories}),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        // Очищаем моки после каждого теста
        jest.clearAllMocks();
    });

    it('Отображение списка новостей', async () => {
        Store.news = mockNews;
        render(<ListNews/>);

        //Проверяем, что элементы с текстом "News Title 1"  и "News Title 2"  присутствуют в DOM.
        expect(screen.getByText('News Title 1')).toBeInTheDocument();
        expect(screen.getByText('News Title 2')).toBeInTheDocument();
    });

    it('Отображение значка загрузки во время загрузки', () => {
        Store.isLoading = true;
        render(<ListNews/>);
        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('Сообщение об ошибке при возникновении ошибки', () => {
        Store.error = 'Error loading news';
        render(<ListNews/>);
        expect(screen.getByText('Error loading news')).toBeInTheDocument();
    });

    it('Фильтр новостей по категориям', async () => {
        Store.news = mockNews;
        Store.categories = mockCategories; // Заполняем Store.categories
        render(<ListNews/>);
        await waitFor(() => {
            expect(Store.categories).toContain('lifestyle');
        });


        // Выбираем категорию "lifestyle"
        fireEvent.click(screen.getByTestId('category-lifestyle'));

        // Ожидаем, что "News Title 2" исчезнет
        await waitFor(() => {
            expect(screen.queryByText('News Title 2')).not.toBeInTheDocument();
        });
    });

    it('Поиск новостей по ключевым словам', async () => {
        jest.useFakeTimers(); // Используем fake timers
        Store.news = mockNews;
        Store.categories = mockCategories;
        render(<ListNews/>);

        // Вводим поисковый запрос "Title 1"
        const searchInput = screen.getByTestId('search-input');
        act(() => {
            fireEvent.change(searchInput, {target: {value: 'Title 1'}});
        });

        // Перематываем время на задержку useDebounce (1500 мс)
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        // Ожидаем, пока "News Title 2" исчезнет из DOM
        await waitFor(() => {
            expect(screen.queryByText('News Title 2')).not.toBeInTheDocument();
        });

        // Проверяем, что отображается только новость с заголовком "News Title 1"
        expect(screen.getByText('News Title 1')).toBeInTheDocument();

        jest.useRealTimers(); // Возвращаем реальные timers
    });
    it('Загрузка новостей при скроллинге', async () => {
        Store.news = mockNews;
        render(<ListNews/>);

        // Имитируем прокрутку до конца списка
        fireEvent.scroll(window, {target: {scrollY: window.innerHeight}});

        // Ожидаем, пока fetchItems будет вызван дважды
        await waitFor(() => {
            expect(Store.fetchItems).toHaveBeenCalledTimes(2);
        });
    });
});



