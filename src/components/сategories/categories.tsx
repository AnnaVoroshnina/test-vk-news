import Store from "../../store/store.tsx";
import styles from "./styles.module.css"
import {CategoriesType} from "../../types/types.ts";
import {v4} from "uuid";

type Props = {
    selectedCategory: CategoriesType | "all"
    setSelectedCategory: (value: CategoriesType | "all") => void
}
export const Categories = ({selectedCategory, setSelectedCategory}: Props) => {
    return (
        <div className={styles.categories}>
            {Store.categories.length > 0 && <button
                key="All"
                data-testid={`category-all`}
                className={selectedCategory === "all" ? styles.active : styles.item}
                onClick={() => setSelectedCategory("all")}
            >
                All
            </button>}
            {Store.categories.map(category => {
                return (
                    <button
                        key={v4()}
                        data-testid={`category-${category}`}
                        className={selectedCategory === category ? styles.active : styles.item}
                        onClick={() => setSelectedCategory(category)}
                    >{category}</button>
                )
            })}
        </div>
    )
}

