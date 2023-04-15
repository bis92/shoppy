import { getProducts } from '../api/firebase';
import { useQuery } from '@tanstack/react-query';

export default function useProducts() {

    const { isLoading, isError, data: products , error } = useQuery(['products'], () => getProducts());

    return { isLoading, isError, products, error };
}

