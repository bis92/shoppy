import React from 'react';

export default function Product({ keyId, product: { imgURL, name, price, category }}) {
    return (
        <div className='flex flex-col w-1/4 m-5'>
            <img className='w-fit' src={imgURL} />
            <div className='flex justify-between font-semibold text-lg'>
                <span>{name}</span>
                <span>\{price}</span>
            </div>
            <div className='text-sm text-zinc-500'>
                <span>{category}</span>
            </div>
        </div>
    );
}

