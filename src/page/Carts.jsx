import React, { useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getCarts } from '../api/firebase';
import { UserContext } from '../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import CartDetail from '../components/CartDetail';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaEquals } from 'react-icons/fa';
export default function Carts() {

    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigate('/')
        }
        });
    }, []);

    const setPriceFormat = (price) => {
        const formatter = new Intl.NumberFormat('ko', {
            style: 'currency',
            currency: 'krw'
        })
        return formatter.format(price);
    }

    const handleGetTotalPrice = (carts) => {
        return carts.reduce((prev, curr) => prev + parseInt(curr.price * curr.count), 0);
    }

    const { isLoading, isError, data: carts , error } = useQuery(['carts'], () => user && getCarts(user.uid, 'cartPage'));
    if (isLoading) {
        return <span>Loading...</span>
    }
    if (isError) {
        return <span>Error: {error.message}</span>
    }
    if(carts){
        return (
            <div className='border-t-2 border-gray-200 mt-2'>
                <h3 className='text-xl font-bold w-full text-center mt-6 mb-2'>내 장바구니</h3>
                <ul className='w-11/12 mx-auto border-y-2 mt-3 border-gray-200 mt-2 py-4 flex flex-col max-h-96 overflow-y-auto'>
                {Object.keys(carts).map((cartItem) => <CartDetail
                    keyId={cartItem}
                    cart={carts[cartItem]}
                    setPriceFormat={setPriceFormat}
                    userId={user.uid}
                />
                )}
                </ul>
                <div className='w-11/12 mt-2 py-4 flex justify-around items-center m-auto'>
                    <div className='flex flex-col bg-gray-50 border-md p-6 rounded-lg'>
                        <span className='text-center'>상품 총액</span>
                        <span className='text-lg text-brand font-bold'>{setPriceFormat(handleGetTotalPrice(Object.values(carts)))}</span>
                    </div>
                    <AiFillPlusCircle className='text-xl'/>
                    <div className='flex flex-col bg-gray-50 border-md p-6 rounded-lg'>
                        <span className='text-center'>배송비</span>
                        <span className='text-lg text-brand font-bold'>{setPriceFormat(3000)}</span>
                    </div>
                    <FaEquals />
                    <div className='flex flex-col bg-gray-50 border-md p-6 rounded-lg'>
                        <span className='text-center'>총 가격</span>
                        <span className='text-lg text-brand font-bold'>{setPriceFormat(handleGetTotalPrice(Object.values(carts))+3000)}</span>
                    </div>
                </div>
                <button className='bg-brand w-11/12 text-white m-auto py-2 text-xl font-bold flex justify-center mt-3 mb-8'>
                    주문 하기
                </button>
            </div>
        );
    }

}

