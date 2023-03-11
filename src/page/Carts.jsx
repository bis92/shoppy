import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Carts() {

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate('/')
        }
        });
    }, [])

    return (
        <div>
            Cart Page
        </div>
    );
}

