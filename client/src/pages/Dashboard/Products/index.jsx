import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';

import styles from './DashboardProducts.module.scss';

const cx = classNames.bind(styles);

const initialFormData = {
    title: '',
    categoryId: '',
    author: '',
    publisher: '',
    isbn: '',
    description: '',
    thumbnail: '',
    price: '',
    stock: '',
    isFeatured: false,
    isActive: true
};

const formatPrice = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(Number(value || 0));

const getImageUrl = (thumbnail) => {
    if (!thumbnail) {
        return '';
    }

    if (/^https?:\/\//i.test(thumbnail)) {
        return thumbnail;
    }

    return `${import.meta.env.VITE_API_URL}${thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`}`;
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const productParams = useMemo(
        () => ({
            keyword: keyword.trim() || undefined,
            isActive: statusFilter === 'all' ? undefined : statusFilter,
            limit: 100
        }),
        [keyword, statusFilter]
    );

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/products', { params: productParams });
            setProducts(response.data?.data || []);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    }, [productParams]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data?.data || []);
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message || 'Không tải được danh mục');
            }
        };

        fetchCategories();
    }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData(initialFormData);
        setIsOpenModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title || '',
            categoryId: product.categoryId || product.category?.id || '',
            author: product.author || '',
            publisher: product.publisher || '',
            isbn: product.isbn || '',
            description: product.description || '',
            thumbnail: product.thumbnail || '',
            price: product.price ? String(product.price) : '',
            stock: product.stock ? String(product.stock) : '0',
            isFeatured: Boolean(product.isFeatured),
            isActive: Boolean(product.isActive)
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setEditingProduct(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock || 0)
        };

        try {
            setSaving(true);

            if (editingProduct) {
                await api.patch(`/products/${editingProduct.id}`, payload);
                toast.success('Cập nhật sản phẩm thành công');
            } else {
                await api.post('/products', payload);
                toast.success('Tạo sản phẩm thành công');
            }

            closeModal();
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không lưu được sản phẩm');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Xóa sản phẩm "${product.title}"?`)) {
            return;
        }

        try {
            await api.delete(`/products/${product.id}`);
            toast.success('Xóa sản phẩm thành công');
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không xóa được sản phẩm');
        }
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý sản phẩm</div>
                    <div className={cx('subtitle')}>Thêm, sửa, xóa và lọc danh sách sản phẩm.</div>
                </div>

                <button className={cx('primaryBtn')} type="button" onClick={openCreateModal}>
                    Thêm sản phẩm
                </button>
            </div>

            <div className={cx('toolbar')}>
                <input
                    className={cx('input')}
                    type="search"
                    placeholder="Tìm theo tên sản phẩm"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <select
                    className={cx('select')}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Đang bán</option>
                    <option value="false">Tạm ẩn</option>
                </select>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Đang tải sản phẩm...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="6">
                                        Chưa có sản phẩm phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className={cx('productCell')}>
                                                <div className={cx('thumb')}>
                                                    {product.thumbnail ? (
                                                        <img src={getImageUrl(product.thumbnail)} alt={product.title} />
                                                    ) : (
                                                        <span>{product.title?.slice(0, 1) || '?'}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>{product.title}</strong>
                                                    <span>{product.author}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category?.name || '-'}</td>
                                        <td>{formatPrice(product.price)}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <span className={cx('badge', product.isActive ? 'active' : 'inactive')}>
                                                {product.isActive ? 'Đang bán' : 'Tạm ẩn'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={cx('rowActions')}>
                                                <button type="button" onClick={() => openEditModal(product)}>
                                                    Sửa
                                                </button>
                                                <button
                                                    className={cx('danger')}
                                                    type="button"
                                                    onClick={() => handleDelete(product)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpenModal && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('modalContent')}>
                        <div className={cx('modalHeader')}>
                            <h2>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                            <button type="button" onClick={closeModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <form className={cx('form')} onSubmit={handleSubmit}>
                            <label>
                                Tên sản phẩm
                                <input
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label>
                                Danh mục
                                <select
                                    name="categoryId"
                                    required
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className={cx('formGrid')}>
                                <label>
                                    Tác giả
                                    <input
                                        name="author"
                                        required
                                        value={formData.author}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Nhà xuất bản
                                    <input
                                        name="publisher"
                                        value={formData.publisher}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <div className={cx('formGrid')}>
                                <label>
                                    Giá
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        required
                                        value={formData.price}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Tồn kho
                                    <input
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>

                            <label>
                                ISBN
                                <input name="isbn" value={formData.isbn} onChange={handleInputChange} />
                            </label>

                            <label>
                                Ảnh đại diện
                                <input
                                    name="thumbnail"
                                    placeholder="/uploads/products/example.jpg"
                                    value={formData.thumbnail}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label>
                                Mô tả
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <div className={cx('checks')}>
                                <label>
                                    <input
                                        name="isFeatured"
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                    />
                                    Nổi bật
                                </label>
                                <label>
                                    <input
                                        name="isActive"
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    Đang bán
                                </label>
                            </div>

                            <div className={cx('modalActions')}>
                                <button type="button" onClick={closeModal}>
                                    Hủy
                                </button>
                                <button className={cx('primaryBtn')} type="submit" disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
