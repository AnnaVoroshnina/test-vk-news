import {useCallback, useEffect, useState} from 'react';
import Store from "../../store/store.tsx";
import {observer} from "mobx-react-lite";
import {
    Grid,
    List,
    Typography
} from "@mui/material";
import styles from './styles.module.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import {ListItemNews} from "../listItemNews/listItemNews.tsx";
import {Loader} from "../loader/loader.tsx";
import {Search} from "../search/search.tsx";
import {useDebounce} from "../../helpers/hooks/useDebounce.ts";
import {CategoriesType, INews} from "../../types/types.ts";
import {v4} from "uuid";
import {Categories} from "../сategories/categories.tsx";


const ListNews = () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoriesType | "all">('all');
    const [filteredNews, setFilteredNews] = useState<INews[]>(Store.news);
    const [keywords, setKeywords] = useState<string>("")
    const debouncedKeywords: string = useDebounce(keywords, 1500)

    useEffect(() => {
        Store.fetchCategories()
        Store.fetchItems();
    }, []);

    // useCallback для мемоизации функции фильтрации новостей
    const filterNews = useCallback((category: CategoriesType | "all", keywords: string) => {
        if (category !== "all") {
            return Store.news.filter(item =>
                item.category.includes(category) &&
                (keywords ? item.title.toLowerCase().includes(keywords.toLowerCase()) : true)
            );
        } else {
            return Store.news.filter(item =>
                keywords ? item.title.toLowerCase().includes(keywords.toLowerCase()) : true
            );
        }
    }, [Store.news]);

    useEffect(() => {
        setFilteredNews(filterNews(selectedCategory, debouncedKeywords));
    }, [selectedCategory, debouncedKeywords, filterNews]);

    return (
        <>
            {Store.error && (
                <div className={styles.error}>
                    {Store.error}
                </div>
            )}
            <Categories
                data-testid={selectedCategory}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <Search keywords={keywords} setKeywords={setKeywords}/>
            <div>
                {Store.isLoading && <Loader/>}
                <List>
                    <InfiniteScroll
                        dataLength={Store.news.length}
                        next={() => Store.fetchItems()} // Передаем номер страницы
                        hasMore={true}
                        loader={<Loader/>}
                    >
                        {filteredNews.length === 0 && !Store.isLoading && selectedCategory !== "all" && (
                            <Typography variant="h6" align="center" gutterBottom sx={{mt: 4, height: 40}}>
                                Новости не найдены
                            </Typography>
                        )}
                        <Grid container spacing={2}> {/* Используем Grid container для создания сетки */}
                            {filteredNews.map(item => (
                                <ListItemNews
                                    key={v4()}
                                    imageUrl={item.image}
                                    title={item.title}
                                    published={item.published}
                                    author={item.author}
                                    id={item.id}/>
                            ))}
                        </Grid>
                    </InfiniteScroll>
                </List>
            </div>
        </>
    );
};

export default observer(ListNews);
