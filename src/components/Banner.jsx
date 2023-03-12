import React from 'react';
import styles from './Banner.module.css';

export default function Banner() {
    return (
        <div className={styles.banner}>
            <img src="./banner.jpg" className={styles.img} />
        </div>
    );
}

