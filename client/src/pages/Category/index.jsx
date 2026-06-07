import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { FaFilter, FaStar } from 'react-icons/fa';
import { formatMoney, getImageUrl } from '~/utils/dashboardUtils';
import { categoryService } from '~/services/categoryService';
import { productService } from '~/services/productService';

import styles from './Category.module.scss';

const cx = classNames.bind(styles);

const allCategoryId = 'all';

export default function Category() {
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search')?.trim() || '';
    const categoryIdParam = searchParams.get('categoryId') || allCategoryId;
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryIdParam);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        setSelectedCategoryId(categoryIdParam);
    }, [categoryIdParam]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await categoryService.getCategories();
                const categoryList = response.data || [];
                setCategories(categoryList.filter((category) => category.isActive));
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || 'Không tải được danh mục sản phẩm');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const productParams = useMemo(
        () => ({
            keyword: searchKeyword || undefined,
            categoryId: selectedCategoryId === allCategoryId ? undefined : selectedCategoryId,
            isActive: 'true',
            limit: 100
        }),
        [searchKeyword, selectedCategoryId]
    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const response = await productService.getProducts(productParams);
                setProducts(response.data || []);
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || 'Không tải được sản phẩm');
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [productParams]);

    const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
    const heading = searchKeyword ? `Kết quả tìm kiếm: "${searchKeyword}"` : selectedCategory?.name || 'Tất cả sách';

    return (
        <div className={cx('category-wrapper')}>
            <div className={cx('container')}>
                <aside className={cx('sidebar')}>
                    <h2 className={cx('sidebar-title')}>
                        <FaFilter /> Bộ lọc sách
                    </h2>
                    <ul className={cx('genre-list')}>
                        <li
                            className={cx('genre-item', { active: selectedCategoryId === allCategoryId })}
                            onClick={() => setSelectedCategoryId(allCategoryId)}
                        >
                            Tất cả sách
                        </li>

                        {loadingCategories ? (
                            <li className={cx('genre-empty')}>Đang tải danh mục...</li>
                        ) : (
                            categories.map((category) => (
                                <li
                                    key={category.id}
                                    className={cx('genre-item', { active: selectedCategoryId === category.id })}
                                    onClick={() => setSelectedCategoryId(category.id)}
                                >
                                    {category.name}
                                </li>
                            ))
                        )}
                    </ul>
                </aside>

                <main className={cx('content')}>
                    <div className={cx('content-header')}>
                        <h1>{heading}</h1>
                        <p>Tìm thấy {products.length} sản phẩm phù hợp</p>
                    </div>

                    {loadingProducts ? (
                        <div className={cx('empty')}>Đang tải sản phẩm...</div>
                    ) : products.length === 0 ? (
                        <div className={cx('empty')}>Chưa có sản phẩm phù hợp.</div>
                    ) : (
                        <div className={cx('products-grid')}>
                            {products.map((product) => (
                                <Link key={product.id} to={`/product/${product.id}`} className={cx('product-card')}>
                                    <div className={cx('thumb')}>
                                        {product.thumbnail ? (
                                            <img src={getImageUrl(product.thumbnail)} alt={product.title} />
                                        ) : (
                                            <span className={cx('thumb-placeholder')}>
                                                {product.title?.slice(0, 1) || '?'}
                                            </span>
                                        )}
                                    </div>

                                    <div className={cx('info')}>
                                        <span className={cx('tag')}>{product.category?.name || 'Sản phẩm'}</span>
                                        <h3 className={cx('title')}>{product.title}</h3>

                                        <div className={cx('rating')}>
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar key={index} className={cx('star')} />
                                            ))}
                                        </div>

                                        <div className={cx('price-row')}>
                                            <span className={cx('price')}>{formatMoney(product.price)}</span>
                                            <span className={cx('btn-add')}>Mua</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
