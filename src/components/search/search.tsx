import styles from './styles.module.css'
import Store from "../../store/store.tsx";
import {ChangeEvent, useState} from "react";

type PropsSearch = {
    keywords: string,
    setKeywords: (keywords: string) => void
}
export const Search = ({keywords, setKeywords}: PropsSearch) => {
    const [showClearButton, setShowClearButton] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setKeywords(event.target.value);
        setShowClearButton(event.target.value.length > 0);
    };

    const clearInput = () => {
        setKeywords("");
        setShowClearButton(false);
    };
    return (
        <>
            {Store.categories.length > 0 &&
                <div className={styles.search}>
                    <input
                        type="text"
                        value={keywords}
                        className={styles.input}
                        onChange={handleChange}
                        placeholder='Search news'
                        data-testid="search-input"
                    />
                    {showClearButton && (
                        <button className={styles.clearButton} onClick={clearInput} data-testid="clear-button">
                            &times;
                        </button>
                    )}
                </div>
            }
        </>
    )
}