import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { AiTwotoneShop, AiOutlineShoppingCart } from 'react-icons/ai';
import { googleLogin, googleLogout, onAuthStateCheck } from '../api/firebase';
import { GrEdit } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function Header() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogin = async () => {
        const res = await googleLogin();
        setUser(res);
    }

    const handleLogout = async () => {
        const res = await googleLogout();
        setUser(res);
    }

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
        });
    }, [])

    // useEffect(() => {
    //     const auth = getAuth();
    //     onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         setUser(user);
    //     } else {
    //         setUser(null);
    //     }
    //     });
    // }, [user])

    return (
        <header className={styles.header}>
            <span className={styles.logo_title} onClick={() => navigate('/')}>
                <span className={styles.logo}><AiTwotoneShop /></span>
                <span className={styles.title}>Shoppy</span>
            </span>
            <nav className={user === null ? styles.nav_sm:styles.nav}>
                <span className={styles.products} onClick={() => navigate('products')}>Product</span>
                <span className={styles.cart} onClick={() => { user === null? navigate('/'):navigate('carts')}}>
                    <AiOutlineShoppingCart />
                </span>
                {user && user.email === 'bistheonlyone@gmail.com' && 
                    <span className={styles.addProduct} onClick={() => navigate('addProduct')}>
                        <GrEdit />
                    </span>
                }
                {user && ( 
                    user.photoURL ?
                    <span className={styles.profile}>
                        <img src={user.photoURL} className={styles.profileImg}/>
                        <span>{user.displayName}</span>
                    </span>  
                    :
                    <span>{user.displayName}</span>
                )
                }
                {user === null && <button className={styles.signInBtn} onClick={handleLogin}>Login</button>}
                {user && <button className={styles.signOutBtn} onClick={handleLogout}>Logout</button>}
            </nav>
        </header>
    );
}

