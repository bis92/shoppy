import React from 'react';
import Product from '../components/Product';
import useProducts from '../hooks/useProducts';

export default function Products() {

    const { isLoading, isError, products, error } = useProducts();
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

