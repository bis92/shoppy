import React from 'react';
import { getProducts } from '../api/firebase';
import { useQuery } from '@tanstack/react-query';
import Product from '../components/Product';

export default function Products() {

    const { isLoading, isError, data: products , error } = useQuery(['products'], () => getProducts());
    if (isLoading) {
        return <span>Loading...</span>
    }
    if (isError) {
        return <span>Error: {error.message}</span>
    }
    return (
        <ul className='flex flex-col justify-around list-none'>
            <li className='flex flex-wrap justify-around m-8'>{products && Object.keys(products).map((product) => <Product keyId={product} key={product} product={products[product]}/>)}</li>
        </ul>
    );
}

