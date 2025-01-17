import {useCallback, useEffect, useState} from 'react';
import Store from "../../shared/store/store.tsx";
import {observer} from "mobx-react-lite";
import {
    Grid,
    List,
    Typography
} from "@mui/material";
import styles from './styles.module.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import {ListItemNews} from "../../shared/ui/listItemNews/listItemNews.tsx";
import {Loader} from "../../shared/ui/loader/loader.tsx";
import {Search} from "../../shared/ui/search/search.tsx";
import {useDebounce} from "../../shared/helpers/hooks/useDebounce.ts";
import {CategoriesType, INews} from "../../app/types/types.ts";
import {v4} from "uuid";
import {Categories} from "../../shared/ui/сategories/categories.tsx";


const ListNews = () => {
    const [selectedCategory, setSelectedCategory] = useState<CategoriesType | "all">('all');
    const [displayedNews, setDisplayedNews] = useState<INews[]>([]);
    const [keywords, setKeywords] = useState<string>("")
    const debouncedKeywords: string = useDebounce(keywords, 1500)
    const [page, setPage] = useState(1) // Номер страницы

    const fetchInitialNews = async () => {
        setPage(1);
        setDisplayedNews([])
        await Store.fetchItems(1);
        setDisplayedNews(Store.news)
    }

    useEffect(() => {
        Store.fetchCategories()
        fetchInitialNews()
    }, []);

    // useCallback для мемоизации функции фильтрации новостей
    const filterNews = useCallback((category: CategoriesType | "all", keywords: string) => {
        return Store.news.filter(item => {
                const categoryCondition = category === "all" || item.category.includes(category)
                const keywordsCondition = !keywords || item.title.toLowerCase().includes(keywords.toLowerCase())
                return categoryCondition && keywordsCondition
            }
        );
    }, [Store.news]);

    const handleLoadMore = async () => {
        const nextPage = page + 1
        setPage(nextPage)
        await Store.fetchItems(nextPage)
        setDisplayedNews(prevDisplayedNews => [...prevDisplayedNews, ...filterNews(selectedCategory, debouncedKeywords)])
    };

    useEffect(() => {
        setDisplayedNews(filterNews(selectedCategory, debouncedKeywords));
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
                        dataLength={displayedNews.length}
                        next={handleLoadMore}
                        hasMore={true}
                        loader={<Loader/>}
                    >
                        {displayedNews.length === 0 && !Store.isLoading && selectedCategory !== "all" && (
                            <Typography variant="h6" align="center" gutterBottom sx={{mt: 4, height: 40}}>
                                Новости не найдены
                            </Typography>
                        )}
                        <Grid container spacing={2}> {/* Используем Grid container для создания сетки */}
                            {displayedNews.map(
                                ({image, title, published, author, id}) => (
                                <ListItemNews
                                    key={v4()}
                                    imageUrl={image}
                                    title={title}
                                    published={published}
                                    author={author}
                                    id={id}/>
                            ))}
                        </Grid>
                    </InfiniteScroll>
                </List>
            </div>
        </>
    );
};

export default observer(ListNews);
