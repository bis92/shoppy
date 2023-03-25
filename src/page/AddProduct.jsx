import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addProduct } from '../api/firebase';
import { v4 as uuidv4 } from 'uuid';
import { GrStatusGood } from 'react-icons/gr'

export default function AddProduct() {

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (!user || (user && user.email && user.email !== 'bistheonlyone@gmail.com')) {
            navigate('/')
        }
        });
    }, [])

    const [newProduct, setNewProduct] = useState({
        imgURL: '',
        name: '',
        price: '',
        category: '',
        description: '',
        option:''
    });
    const [file, setFile] = useState('');
    const [selectedImg, setSelectedImg] = useState('');
    const [loading, setLoading] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setNewProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleChangeFile = (e) => {
        console.log(e.target.files);
        console.log(e.target.value);
        const files = e.target.files;
        const fileReader = new FileReader();
        
        fileReader.readAsDataURL(files[0]);
        fileReader.onload = (e) => {
            setSelectedImg(e.target.result);
        };
        setFile(e.target.value);
    }

    const displaySuccess = async () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false)
            setSelectedImg('')
            setNewProduct({
                imgURL: '',
                name: '',
                price: '',
                category: '',
                description: '',
                option:''
            })
        }, 5000)
    }

    const handleSubmit = async (e) => {
        if(e) {
            e.preventDefault();
        }
        setLoading(true)
        const files = document.querySelector("[type=file]").files;
        console.log(process.env.REACT_APP_CLOUDINARY_API_KEY, process.env.REACT_APP_CLOUDINARY_PRESET)
        const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
        formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
        const res = await axios.post(url,formData);
        console.log(res);
        if(res && res.status === 200){
            console.log(res.data.url);
            const productId = uuidv4();
            const imgURL = res.data.url;
            imgURL && await addProduct(newProduct, productId, imgURL);
            setLoading(false);
            displaySuccess();
        }
    }

    const { name, price, category, description, option } = newProduct;
    return (
        <div className="flex flex-col justify-start border-t-4 mt-6 border-t-gray-300 border-solid h-3/5 max-h-full my-2">
            <span className="flex justify-center text-2xl mt-4">새로운 제품 등록</span>
            {loading && <p className='flex justify-center'>상품을 등록중입니다...</p>}
            {success && <span className='flex justify-center'>
                <GrStatusGood className="text-xl"/>
                <p>상품을 등록했습니다.</p>
                </span>}
            {selectedImg && 
            <span className='flex justify-center'>
                <img src={selectedImg} className="flex w-1/5 m-0 p-4 selected img"/>
            </span>
            }
            <form className="flex-col justify-around h-100" onSubmit={handleSubmit}>
                <input className="flex p-4 my-2 w-full border-2 border-gray-300 upload img" name='file' type='file' value={file} onChange={handleChangeFile} />
                <input className="flex p-4 my-2 w-full border-2 border-gray-300" name='name' type='text' placeholder='제품명' value={name} onChange={handleChange} />
                <input className="flex p-4 my-2 w-full border-2 border-gray-300" name='price' type='text' placeholder='가격' value={price} onChange={handleChange} />
                <input className="flex p-4 my-2 w-full border-2 border-gray-300" name='category' type='text' placeholder='카테고리' value={category} onChange={handleChange} />
                <input className="flex p-4 my-2 w-full border-2 border-gray-300" name='description' type='text' placeholder='제품 설명' value={description} onChange={handleChange} />
                <input className="flex p-4 my-2 w-full border-gray-300 border-2" name='option' type='text' placeholder='옵션들(콤마(,)로 구분)' value={option} onChange={handleChange} />
                <button 
                    className="bg-brand border-none text-white text-2xl w-10/12 p-4 m-auto my-4 flex justify-center"
                >
                    제품 등록하기
                </button>
            </form>
        </div>
    );
}

