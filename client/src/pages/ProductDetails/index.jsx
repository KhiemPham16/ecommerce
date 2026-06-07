import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'sonner';
import { FaCheckCircle, FaShoppingCart, FaStar } from 'react-icons/fa';

import { formatMoney, getImageUrl } from '~/utils/dashboardUtils';
import { productService } from '~/services/productService';
import { useCartStore } from '~/stores/useCartStore';

import styles from './ProductDetails.module.scss';

const cx = classNames.bind(styles);

export default function ProductDetails() {
    const { slug: productId } = useParams();

    const { addToCart } = useCartStore();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductById(productId);
                setProduct(response.data || null);
            } catch (error) {
                console.error(error);
                setProduct(null);
                toast.error(error?.response?.data?.message || 'Không tải được chi tiết sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleQuantityChange = (type) => {
        if (type === 'dec') {
            setQuantity((prev) => Math.max(1, prev - 1));
            return;
        }

        setQuantity((prev) => Math.min(Number(product?.stock || 1), prev + 1));
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (Number(product.stock || 0) <= 0) {
            toast.error('Sản phẩm đã hết hàng');
            return;
        }

        addToCart(
            {
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock,
                category: product.category,
                author: product.author,
                publisher: product.publisher,
                isbn: product.isbn
            },
            quantity
        );
    };

    if (loading) {
        return (
            <div className={cx('detail-wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('stateBox')}>Đang tải chi tiết sản phẩm...</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={cx('detail-wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('stateBox')}>
                        <h2>Không tìm thấy sản phẩm</h2>
                        <Link to="/category">Quay lại danh mục</Link>
                    </div>
                </div>
            </div>
        );
    }

    const inStock = Number(product.stock || 0) > 0;
    const thumbnail = product.thumbnail;

    return (
        <div className={cx('detail-wrapper')}>
            <div className={cx('container')}>
                <div className={cx('main-info')}>
                    <div className={cx('image-column')}>
                        <div className={cx('main-image')}>
                            {thumbnail ? (
                                <img src={getImageUrl(thumbnail)} alt={product.title} />
                            ) : (
                                <div className={cx('image-placeholder')}>{product.title?.slice(0, 1) || '?'}</div>
                            )}
                        </div>
                    </div>

                    <div className={cx('content-column')}>
                        <span className={cx('tag')}>{product.category?.name || 'Sản phẩm'}</span>

                        <h1 className={cx('product-title')}>{product.title}</h1>

                        <div className={cx('rating-row')}>
                            <div className={cx('stars')}>
                                {[...Array(5)].map((_, index) => (
                                    <FaStar key={index} />
                                ))}
                            </div>

                            <span className={cx('reviews-count')}>Sản phẩm từ kho sách</span>
                        </div>

                        <div className={cx('price-box')}>
                            <span className={cx('current-price')}>{formatMoney(product.price)}</span>
                        </div>

                        <p className={cx('short-desc')}>{product.description || 'Sản phẩm chưa có mô tả ngắn.'}</p>

                        <div className={cx('book-meta')}>
                            <span>Tác giả: {product.author || '-'}</span>
                            <span>Nhà xuất bản: {product.publisher || '-'}</span>
                            <span>ISBN: {product.isbn || '-'}</span>
                        </div>

                        <div className={cx('status-row')}>
                            <FaCheckCircle className={cx(inStock ? 'icon-check' : 'icon-muted')} />
                            <span>
                                Tình trạng: <strong>{inStock ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}</strong>
                            </span>
                        </div>

                        <div className={cx('action-row')}>
                            <div className={cx('quantity-selector')}>
                                <button type="button" onClick={() => handleQuantityChange('dec')} disabled={!inStock}>
                                    -
                                </button>

                                <span>{quantity}</span>

                                <button type="button" onClick={() => handleQuantityChange('inc')} disabled={!inStock}>
                                    +
                                </button>
                            </div>

                            <button
                                className={cx('btn-add-cart')}
                                type="button"
                                disabled={!inStock}
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart />
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>

                <div className={cx('detail-description')}>
                    <h2>Mô tả sản phẩm</h2>

                    <div className={cx('desc-content')}>
                        <p>{product.description || 'Sản phẩm chưa có mô tả chi tiết.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
