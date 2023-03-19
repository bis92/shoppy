import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/firebase';
import { useQuery } from '@tanstack/react-query';
import Product from '../components/Product';

export default function Products() {

    // useEffect(() => {
    //     console.log(products)
    // }, [products])

    const readProducts = async () => {
        const res = await getProducts();
        const objectKeys = Object.keys(res);
        objectKeys.map((keyId) => res[keyId])
        console.log(Object.keys(res));
    }

    const { isLoading, isError, data: products , error } = useQuery(['products'], () => getProducts());
    if (isLoading) {
        return <span>Loading...</span>
    }
    if (isError) {
        return <span>Error: {error.message}</span>
    }
    return (
        <ul className='flex flex-col justify-around flex-wrap list-none'>
            <li className='flex m-4'>{products && Object.keys(products).map((product, index) => <Product keyId={product} product={products[product]}/>)}</li>
        </ul>
    );
}

