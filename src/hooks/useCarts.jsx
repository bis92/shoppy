import { useContext } from 'react';
import { getCarts } from '../api/firebase';
import { UserContext } from '../context/UserContext';
import { useQuery } from '@tanstack/react-query';

export default function useCarts() {

    const { user } = useContext(UserContext);
    const { isLoading, isError, data: carts , error } = useQuery(['carts'], () => user && getCarts(user.uid));

    return { isLoading, isError, carts, error };
}

