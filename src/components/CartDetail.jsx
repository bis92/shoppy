import React from 'react';
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from 'react-icons/ai';
import { BsFillTrash3Fill } from 'react-icons/bs';
import { removeCartItem, updateCartCount } from '../api/firebase';
import { useQueryClient } from '@tanstack/react-query';
export default function CartDetail({cart: {imgURL, name, size, price, count, productId}, setPriceFormat, keyId, userId}) {

    const queryClient = useQueryClient();

    const updateCart = (variable) => {
        if(variable === 'decrease' && count <= 1){
            return;
        }
        updateCartCount(userId, keyId, variable);
        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['carts']})
        }, 500)
        
    }
    const removeCart = () => {
        removeCartItem(userId, keyId)
        queryClient.invalidateQueries({ queryKey: ['carts'] })
    }

    return (
        <li className='flex py-2 align-middle px-8'>
            <span className='w-44'><img className='rounded-lg' src={imgURL} /></span>
            <div className='w-8/12 flex flex-col justify-center align-baseline ml-6 text-md'>
                <span>{name}</span>
                <span className='text-brand font-bold'>{size}</span>
                <span>{setPriceFormat(price)}</span>
            </div>
            <div className='flex justify-center items-center m-auto'>
                <AiOutlineMinusSquare className='mr-2 text-xl text-center cursor-pointer' onClick={() => updateCart('decrease')}/>
                <span className='mr-2 text-2xl'>{count}</span>
                <AiOutlinePlusSquare className='mr-2 text-2xl cursor-pointer' onClick={() => updateCart('increase')}/>
                <BsFillTrash3Fill className='mr-2 text-xl cursor-pointer' onClick={removeCart}/>
            </div>
        </li>
    );
}

