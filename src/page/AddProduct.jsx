import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styles from './AddProduct.module.css';
import axios from 'axios';
import { addProduct } from '../api/firebase';
import { v4 as uuidv4 } from 'uuid';

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

    const handleChange = (e) => {
        setNewProduct((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    const handleSubmit = async (e) => {
        if(e) {
            e.preventDefault();
        }
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
            imgURL && addProduct(newProduct, productId, imgURL);
        }
    }
    const { file, name, price, category, description, option } = newProduct;
    return (
        <div className={styles.addProduct}>
            <h3 className={styles.title}>새로운 제품 등록</h3>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input className={styles.input} name='file' type='file' value={file} />
                <input className={styles.input} name='name' type='text' placeholder='제품명' value={name} onChange={handleChange} />
                <input className={styles.input} name='price' type='text' placeholder='가격' value={price} onChange={handleChange} />
                <input className={styles.input} name='category' type='text' placeholder='카테고리' value={category} onChange={handleChange} />
                <input className={styles.input} name='description' type='text' placeholder='제품 설명' value={description} onChange={handleChange} />
                <input className={styles.input} name='option' type='text' placeholder='옵션들(콤마(,)로 구분)' value={option} onChange={handleChange} />
                <button 
                    className={styles.btn_submit}
                >
                    제품 등록하기
                </button>
            </form>
        </div>
    );
}

