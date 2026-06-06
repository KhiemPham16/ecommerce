import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FaStar, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import styles from './ProductDetails.module.scss';

const cx = classNames.bind(styles);

const books = [
    {
        id: 1,
        slug: 'nha-gia-kim',
        title: 'Nhà Giả Kim',
        genre: 'Tiểu thuyết',
        price: 79000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        slug: 'dac-nhan-tam',
        title: 'Đắc Nhân Tâm',
        genre: 'Tâm lý học',
        price: 86000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        slug: 'luoc-su-loai-nguoi',
        title: 'Lược Sử Loài Người',
        genre: 'Lịch sử',
        price: 135000,
        rating: 4,
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 4,
        slug: 'clean-code',
        title: 'Clean Code',
        genre: 'Công nghệ',
        price: 210000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60'
    }
];

export default function ProductDetails() {
    const { slug } = useParams();

    const [quantity, setQuantity] = useState(1);

    const product = books.find((item) => item.slug === slug);

    if (!product) {
        return (
            <div className={cx('container')}>
                <h2>Không tìm thấy sản phẩm</h2>
            </div>
        );
    }

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }

        if (type === 'inc') {
            setQuantity((prev) => prev + 1);
        }
    };

    return (
        <div className={cx('detail-wrapper')}>
            <div className={cx('container')}>
                <div className={cx('main-info')}>
                    <div className={cx('image-column')}>
                        <div className={cx('main-image')}>
                            <img src={product.image} alt={product.title} />
                        </div>
                    </div>

                    <div className={cx('content-column')}>
                        <span className={cx('tag')}>{product.genre}</span>

                        <h1 className={cx('product-title')}>{product.title}</h1>

                        <div className={cx('rating-row')}>
                            <div className={cx('stars')}>
                                {[...Array(product.rating)].map((_, index) => (
                                    <FaStar key={index} />
                                ))}
                            </div>

                            <span className={cx('reviews-count')}>({product.rating} sao)</span>
                        </div>

                        <div className={cx('price-box')}>
                            <span className={cx('current-price')}>{(product.price || 0).toLocaleString()}đ</span>

                            {product.oldPrice && (
                                <span className={cx('old-price')}>{product.oldPrice.toLocaleString()}đ</span>
                            )}
                        </div>

                        <p className={cx('short-desc')}>{product.description}</p>

                        <div className={cx('status-row')}>
                            <FaCheckCircle className={cx('icon-check')} />
                            <span>
                                Tình trạng: <strong>Còn hàng</strong>
                            </span>
                        </div>

                        <div className={cx('action-row')}>
                            <div className={cx('quantity-selector')}>
                                <button onClick={() => handleQuantityChange('dec')}>-</button>

                                <span>{quantity}</span>

                                <button onClick={() => handleQuantityChange('inc')}>+</button>
                            </div>

                            <button className={cx('btn-add-cart')}>
                                <FaShoppingCart />
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>

                <div className={cx('detail-description')}>
                    <h2>Mô tả sản phẩm</h2>

                    <div className={cx('desc-content')}>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
