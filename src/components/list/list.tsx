import {useEffect, useState} from 'react';
import Store, {CategoriesType, INews} from "../../store/store.tsx";
import {observer} from "mobx-react-lite";
import {formatTimeAgo} from "../../utils.ts";
import {v4} from 'uuid';
import {
    Avatar,
    Button,
    CircularProgress,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack, Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {Edit} from "@mui/icons-material";
import styles from './styles.module.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import {Categories} from "../сategories/Categories.tsx";


const ListNews = () => {
    useEffect(() => {
        Store.fetchCategories()
        Store.fetchItems();
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<CategoriesType | "all">('all');
    const [filteredNews, setFilteredNews] = useState<INews[]>(Store.news);

    useEffect(() => {
        if (selectedCategory !== "all"){
            setFilteredNews(Store.news.filter(item => {
                return item.category.includes(selectedCategory)
            }))
        } else {
            setFilteredNews(Store.news)
        }
    }, [selectedCategory, Store.news]);

    return (
        <>
            <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
            <div>
                {Store.isLoading && <Stack alignItems="center">
                    <CircularProgress/>
                </Stack>
                }
                <List>
                    <InfiniteScroll
                        dataLength={Store.news.length}
                        next={() => Store.fetchItems(Store.currentPage)} // Передаем номер страницы
                        style={{minHeight: '0px'}}
                        hasMore={!(filteredNews.length < 3 && !Store.isLoading)}
                        loader={null}
                    >
                        {filteredNews.length === 0 && !Store.isLoading && (
                            <Typography variant="h6" align="center" gutterBottom>
                                Новости не найдены
                            </Typography>
                        )}
                        <Grid container spacing={2}> {/* Используем Grid container для создания сетки */}
                            {filteredNews.map(item => (
                                <Grid item xs={12} sm={6} md={4} key={v4()} display="flex" justifyContent="center"
                                      alignItems="start">
                                    <ListItem key={v4()} className={styles.newsItem} sx={{width: 300, padding: 0}}>
                                        <ListItemAvatar>
                                            {item.image
                                                ? (<Avatar
                                                    alt="Фото новости"
                                                    src={item.image}
                                                    sx={{width: 300, height: 300, borderRadius: 2}}/>)
                                                : <Avatar
                                                    sx={{
                                                        width: 300,
                                                        height: 300,
                                                        borderRadius: 2,
                                                        backgroundColor: "black"
                                                    }}>
                                                    нет картинки
                                                </Avatar>
                                            }

                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={item.title}
                                            secondary={`${formatTimeAgo(item.published)} by ${item.author}`}/>
                                        <Stack spacing={2} direction="row">
                                            <Button variant="text"
                                                    onClick={() => Store.editItem(item.id, 'New name')}>
                                                <Edit/>
                                            </Button>
                                            <Button
                                                variant="text"
                                                onClick={() => Store.deleteItem(item.id)}>
                                                <DeleteIcon/>
                                            </Button>
                                        </Stack>
                                    </ListItem>
                                </Grid>
                            ))}
                        </Grid>
                        {filteredNews.length < 3 && <div style={{height: '0px'}}/>} {/* Заполнитель */}
                    </InfiniteScroll>
                </List>
            </div>
        </>
    );
};

export default observer(ListNews);
