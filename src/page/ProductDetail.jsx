import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addCart } from '../api/firebase';
import { UserContext } from '../context/UserContext';

export default function ProductDetail() {
    const { user } = useContext(UserContext);
    const [size, setSize] = useState('');
    const { state: {imgURL, name, category, price, description, option, id } } = useLocation();
    const [message, setMessage] = useState('');
    const handleChange = (e) => {
        setSize(e.target.value);
    }

    const displayMessage = (messageVal) => {
        setTimeout(() => {
            setMessage('');
        }, 5000)
    }
    const handleSubmit = async (e) => {
        if(e) {
            e.preventDefault();
        }
        const res = await addCart(id, imgURL, name, size, price, user.uid)
        if(res){
            setMessage(res.message)
            displayMessage(res.message);
        }
    }
    return (
        <div className="flex flex-col justify-center mt-4 w-11/12 m-auto">
            <span className='flex justify-start my-4'>>{category}</span>
            <div className='flex justify-center'>
                <img src={imgURL} className='w-1/2' />
                <div className='flex flex-col w-1/2 p-4'>
                    <span className='text-2xl font-semibold mb-2'>{name}</span>
                    <span className='text-xl border-b-2 pb-1 border-gray-200 font-medium pb-3'>{price}원</span>
                    <span className='pt-4 pb-6 px-2'>{description}</span>
                    {user && <form className='flex flex-col' onSubmit={handleSubmit}>
                        <div className='flex mb-4'>
                            <span className='text-brand font-semibold w-1/12'>옵션: </span>
                            <select value={size} onChange={handleChange} className="w-11/12 border-2 border-dashed border-brand">
                                {option.split(',').map((opt) => {
                                    return <option value={opt}>{opt}</option>
                                })}
                            </select>
                        </div>
                        <button className='bg-brand w-4/6 py-2 px-4 m-auto text-white text-xl font-bold'>장바구니에 추가</button>
                        {message && <span className='flex justify-center font-semibold mt-4'>{message}</span>}
                        </form>}
                </div>
            </div>
        </div>
    );
}

