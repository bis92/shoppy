import React from 'react';
import styles from './Header.module.css';
import { AiTwotoneShop } from 'react-icons/ai';
import { googleLogin } from '../api/firebase';

export default function Header() {
    return (
        <header className={styles.header}>
            <span className={styles.logo_title}>
                <span className={styles.logo}><AiTwotoneShop /></span>
                <span className={styles.title}>Shoppy</span>
            </span>
            <nav>
                <button onClick={googleLogin}>Login</button>
            </nav>
        </header>
    );
}

