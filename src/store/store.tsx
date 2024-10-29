import {observable, action, makeObservable} from 'mobx';

const API_KEY = "Eam40-oJlUKMEeSYPWiyP8U7ZDDtSh15PH5JIyv3-8f9L8Z3"
const BASE_URL = "https://api.currentsapi.services/v1"

export type CategoriesType =
    | "regional"
    | "technology"
    | "lifestyle"
    | "business"
    | "general"
    | "programming"
    | "science"
    | "entertainment"
    | "world"
    | "sports"
    | "finance"
    | "academia"
    | "politics"
    | "health"
    | "opinion"
    | "food"
    | "game"
    | "fashion"
    | "academic"
    | "crap"
    | "travel"
    | "culture"
    | "economy"
    | "environment"
    | "art"
    | "music"
    | "notsure"
    | "CS"
    | "education"
    | "redundant"
    | "television"
    | "commodity"
    | "movie"
    | "entrepreneur"
    | "review"
    | "auto"
    | "energy"
    | "celebrity"
    | "medical"
    | "gadgets"
    | "design"
    | "EE"
    | "security"
    | "mobile"
    | "estate"
    | "funny";

export interface INews {
    author: string;
    category: CategoriesType[];
    description: string;
    id: string;
    image: string;
    language: string;
    published: string;
    title: string
    url: string
}

class Store {
    news: INews[] = [];
    categories: CategoriesType[] =[]
    isLoading: boolean = false;
    currentPage: number = 1;
    deletedNewsIds: string[] = []
    totalNewsCountForCategory: number | null = null;


    constructor() {
        makeObservable(this, {
            news: observable,
            categories: observable,
            isLoading: observable,
            currentPage: observable,
            deletedNewsIds:observable,
            totalNewsCountForCategory: observable,
            fetchItems: action,
            editItem: action,
            deleteItem: action
        });
    }


    async fetchItems(page: number = 1) {
        this.isLoading = true;
        try {
            const response = await fetch(`${BASE_URL}/search?apiKey=${API_KEY}&page_number=${page}&page_size=20`); // Добавляем параметр page
            const data = await response.json();
            // Фильтруем новые новости, чтобы избежать дубликатов
            const dataNews = data.news.filter((newItem:INews) =>
                !this.news.some(existingItem => existingItem.id === newItem.id)
            );
            this.news = [...this.news, ...dataNews].filter(item => !this.deletedNewsIds.includes(item.id)); // Фильтруем новости
            this.currentPage++; // Увеличиваем номер страницы

        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
    }

    async fetchCategories () {
        try {
            const response = await fetch(`${BASE_URL}/available/categories?apiKey=${API_KEY}`); // Добавляем параметр page
            const data = await response.json();
            const dataNews = await data.categories;
            this.categories = [...this.categories, ...dataNews];
        } catch (error) {
            console.error(error);
        }
    }

    editItem(id: string, title: string) {
        const index = this.news.findIndex(item => item.id === id);
        if (index !== -1) {
            this.news[index].title = title;
        }
    }

    deleteItem(id: string) {
        this.news = this.news.filter(item => item.id !== id);
        this.deletedNewsIds.push(id); // Добавляем id в список удаленных
    }
}

export default new Store();

