import {useEffect, useState} from "react";
import styles from './styles.module.css'

export const Header = () => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        setTime(new Date());
    }, [])

    return (
        <header className={`${styles.header}`}>
            <div className={styles.info}>
                <h1 className={styles.title}>NEWS</h1>
                <p className={styles.date}>
                    {time.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }
                    )}</p>
            </div>
        </header>
    )
}