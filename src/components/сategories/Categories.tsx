import Store, {CategoriesType} from "../../store/store.tsx";
import styles from "./styles.module.css"
import {v4} from 'uuid';


type Props = {
    selectedCategory: CategoriesType | "all"
    setSelectedCategory: (value: CategoriesType | "all") => void
}
export const Categories = ({selectedCategory, setSelectedCategory}: Props) => {

    return (
        <div className={styles.categories}>
            {Store.categories.length > 0 && <button
                key="All"
                className={selectedCategory === "all" ? styles.active : styles.item}
                onClick={() => setSelectedCategory("all")}
            >
                All
            </button>}
            {Store.categories.map(category => {
                return (
                    <button
                        key={v4()}
                        className={selectedCategory === category ? styles.active : styles.item}
                        onClick={() => setSelectedCategory(category)}
                    >{category}</button>
                )
            })}
        </div>
    )
}

