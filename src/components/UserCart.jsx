import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { getCarts } from '../api/firebase';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function UserCart() {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { isLoading, isError, data: carts , error } = useQuery(['carts'], () => user && getCarts(user.uid));
    if (isLoading) {
        return <span>Loading...</span>
    }
    if (isError) {
        // return <span>Error: {error.message}</span>
        return <AiOutlineShoppingCart className='text-3xl' />
    }

    if(carts){
        return (
            <span className='cursor-pointer' onClick={() => { user === null? navigate('/'):navigate('carts')}}>
                <AiOutlineShoppingCart className='text-3xl' />
                {Object.values(carts).length > 0 && <span className='absolute top-1 ml-4 rounded-2xl text-sm bg-red-600 py-0.5 px-2 text-white border-r-0'>{Object.values(carts).length }</span>}
            </span>
        );
    } else {
        return <AiOutlineShoppingCart className='text-3xl' />
    }
}

