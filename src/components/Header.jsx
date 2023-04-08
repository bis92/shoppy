import React, { useContext, useEffect, useState } from 'react';
import styles from './Header.module.css';
import { AiTwotoneShop } from 'react-icons/ai';
import { getCarts, googleLogin, googleLogout } from '../api/firebase';
import { GrEdit } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import UserCart from './UserCart';
export default function Header() {

    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext);
    const [cartItem, setCartItem] = useState([]);

    const handleLogin = async () => {
        const res = await googleLogin();
        updateUser(res);
    }

    const handleLogout = async () => {
        const res = await googleLogout();
        updateUser(res);
    }

    const handleGetCart = async () => {
        if(user){
            const res = await getCarts(user.uid);
            if(res){
                const cartArr = Object.values(res);
                return setCartItem(cartArr);
            }
        } else {
            return setCartItem([]);
        }
    }

    useEffect(() => {
        // handleGetCart();
    }, [user])

    return (
        <header className={styles.header}>
            <span className={styles.logo_title} onClick={() => navigate('/')}>
                <span className={styles.logo}><AiTwotoneShop /></span>
                <span className={styles.title}>Shoppy</span>
            </span>
            <nav className={user === null ? styles.nav_sm:styles.nav}>
                <span className={styles.products} onClick={() => navigate('products')}>Product</span>
                {user && <UserCart

                    />
                }
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



