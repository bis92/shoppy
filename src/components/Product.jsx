import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Product({ keyId, product: { id, imgURL, name, price, category, description, option }}) {

    const navigate = useNavigate();
    const formatter = new Intl.NumberFormat('ko', {
        style: 'currency',
        currency: 'krw'
    })
    return (
        <div className='flex flex-col w-80 m-4 cursor-pointer' onClick={() => navigate(`/products/${id}`, { state: {id, imgURL, name, price, category, description, option}})}>
            <img className='w-fit rounded-t-xl' src={imgURL} />
            <div className="border-gray-100 border-2 p-2 rounded-b-xl">
                <div className='flex justify-between font-semibold text-lg'>
                    <span>{name}</span>
                    <span>{formatter.format(price)}</span>
                </div>
                <div className='text-sm text-zinc-500'>
                    <span>{category}</span>
                </div>
            </div>
        </div>
    );
}

