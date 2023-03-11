import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (!user || (user && user.email && user.email !== 'bistheonlyone@gmail.com')) {
            navigate('/')
        }
        });
    }, [])
    return (
        <div>
            AddProduct
        </div>
    );
}

