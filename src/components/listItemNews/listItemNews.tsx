import {Button, Grid, ListItem, ListItemAvatar, ListItemText, Stack, TextField} from "@mui/material";
import {v4} from "uuid";
import styles from "./styles.module.css";
import Store from "../../store/store.tsx";
import {Edit} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {FC, useCallback, useState} from "react";
import {formatTimeAgo} from "../../utils/formatTime/formatTimeAgo.ts";

type Props = {
    imageUrl: string;
    title: string;
    published: string;
    author: string;
    id: string
}

export const ListItemNews: FC<Props> = ({imageUrl, title, published, author, id}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(title)

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
        setEditText(title)
    }, [title]);
    const handleSaveClick = useCallback(() => {
        setIsEditing(false);
        Store.editItem(id, editText)
    }, [editText, id]);

    return (
        <Grid item xs={12} sm={6} md={4} key={v4()} display="flex" justifyContent="center"
              alignItems="start">
            <ListItem role="listitem" key={v4()} className={styles.newsItem} sx={{width: 300, padding: 0}}>
                <ListItemAvatar>
                    {imageUrl
                        ? (<img
                            className={styles.img}
                            alt="Фото новости"
                            src={imageUrl}
                            width={300}
                            height={300}
                            style={{"borderRadius": "10px"}}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "https://mart812.ru/files/products/nofoto_9.800x600.jpg";
                            }}
                        />)
                        : <img
                            alt="Нет фото новости"
                            src="https://mart812.ru/files/products/nofoto_9.800x600.jpg"
                            width={300}
                            height={300}
                            style={{"borderRadius": "10px"}}/>
                    }
                </ListItemAvatar>
                <ListItemText
                    primary={isEditing ? (
                        <TextField
                            defaultValue={editText}
                            autoFocus={isEditing}
                            onChange={(event) => setEditText(event.target.value)}
                            multiline
                            rows={3}
                            sx={{width: '295px'}}
                        />
                    ) : title}
                    secondary={`${formatTimeAgo(published)} by ${author}`}/>
                <Stack spacing={2} direction="row">
                    {isEditing ? (
                        <Button onClick={handleSaveClick}>Сохранить</Button>
                    ) : <Button variant="text"
                                aria-label="Редактировать"
                                onClick={handleEditClick}>
                        <Edit/>
                    </Button>}
                    <Button
                        variant="text"
                        aria-label="Удалить"
                        onClick={() => Store.deleteItem(id)}>
                        <DeleteIcon/>
                    </Button>
                </Stack>
            </ListItem>
        </Grid>
    )
}
