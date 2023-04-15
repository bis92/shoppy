import React  from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import useCarts from '../hooks/useCarts';

export default function UserCart() {

    const navigate = useNavigate();
    const { isLoading, isError, carts } = useCarts();
    if (isLoading) {
        return <span>Loading...</span>
    }
    if (isError) {
        return <AiOutlineShoppingCart className='text-3xl' />
    }

    if(carts){
        return (
            <span className='cursor-pointer' onClick={() => navigate('carts')}>
                <AiOutlineShoppingCart className='text-3xl' />
                {Object.values(carts).length > 0 && <span className='absolute top-1 ml-4 rounded-2xl text-sm bg-red-600 py-0.5 px-2 text-white border-r-0'>{Object.values(carts).length }</span>}
            </span>
        );
    } else {
        return <AiOutlineShoppingCart className='text-3xl' />
    }
}

