import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'sonner';

import { axiosInstance as api } from '~/lib/axios';

import styles from './DashboardBlogs.module.scss';

const cx = classNames.bind(styles);

const postStatuses = ['DRAFT', 'PUBLISHED'];

const statusLabels = {
    DRAFT: 'Draft',
    PUBLISHED: 'Public'
};

const initialFormData = {
    title: '',
    dek: '',
    excerpt: '',
    bodyHtml: '',
    coverImageUrl: '',
    readMinutes: '3',
    featured: false,
    status: 'DRAFT'
};

const getPostList = (payload) => {
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.data?.posts)) {
        return payload.data.posts;
    }

    if (Array.isArray(payload?.posts)) {
        return payload.posts;
    }

    return [];
};

const getPostData = (payload) => payload?.data?.post || payload?.data || payload?.post || payload;

const normalizeStatus = (status) => {
    const value = String(status || 'DRAFT').toUpperCase();
    return value === 'PUBLISHED' || value === 'PUBLIC' ? 'PUBLISHED' : 'DRAFT';
};

const getPostId = (post) => post?.id || post?._id;

const formatDate = (value) => {
    if (!value) {
        return '-';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
};

const getImageUrl = (thumbnail) => {
    if (!thumbnail) {
        return '';
    }

    if (/^https?:\/\//i.test(thumbnail)) {
        return thumbnail;
    }

    return `${import.meta.env.VITE_API_URL}${thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`}`;
};

export default function Blogs() {
    const [posts, setPosts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [formData, setFormData] = useState(initialFormData);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/posts');
            setPosts(getPostList(response.data));
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách bài viết');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const filteredPosts = useMemo(() => {
        const search = keyword.trim().toLowerCase();

        return posts.filter((post) => {
            const status = normalizeStatus(post.status);
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            const matchesKeyword =
                !search ||
                [post.title, post.excerpt, post.summary, post.slug, post.author?.fullName]
                    .filter(Boolean)
                    .some((value) => value.toLowerCase().includes(search));

            return matchesStatus && matchesKeyword;
        });
    }, [posts, keyword, statusFilter]);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openCreateModal = () => {
        setEditingPost(null);
        setFormData(initialFormData);
        setIsOpenModal(true);
    };

    const openEditModal = (post) => {
        setEditingPost(post);
        setFormData({
            title: post.title || '',
            dek: post.dek || '',
            excerpt: post.excerpt || post.summary || '',
            bodyHtml: post.bodyHtml || post.content || post.body || '',
            coverImageUrl: post.coverImageUrl || post.thumbnail || post.coverImage || post.image || '',
            readMinutes: post.readMinutes ? String(post.readMinutes) : '3',
            featured: Boolean(post.featured),
            status: normalizeStatus(post.status)
        });
        setIsOpenModal(true);
    };

    const closeModal = () => {
        setIsOpenModal(false);
        setEditingPost(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            title: formData.title.trim(),
            dek: formData.dek.trim(),
            excerpt: formData.excerpt.trim(),
            bodyHtml: formData.bodyHtml.trim(),
            coverImageUrl: formData.coverImageUrl.trim() || undefined,
            readMinutes: Number(formData.readMinutes || 3),
            featured: formData.featured,
            status: formData.status
        };

        try {
            setSaving(true);

            if (editingPost) {
                await api.patch(`/posts/${getPostId(editingPost)}`, payload);
                toast.success('Cập nhật bài viết thành công');
            } else {
                await api.post('/posts', payload);
                toast.success('Tạo bài viết thành công');
            }

            closeModal();
            fetchPosts();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không lưu được bài viết');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (post) => {
        if (!window.confirm(`Xóa bài viết "${post.title}"?`)) {
            return;
        }

        try {
            await api.delete(`/posts/${getPostId(post)}`);
            toast.success('Xóa bài viết thành công');
            fetchPosts();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không xóa được bài viết');
        }
    };

    const handleStatusChange = async (post, status) => {
        if (normalizeStatus(post.status) === status) {
            return;
        }

        try {
            const postId = getPostId(post);
            setUpdatingId(postId);
            const response = await api.patch(`/posts/${postId}`, { status });
            const updatedPost = getPostData(response.data);

            setPosts((current) =>
                current.map((item) => (getPostId(item) === postId ? { ...item, ...updatedPost, status } : item))
            );
            setSelectedPost((current) =>
                getPostId(current) === postId ? { ...current, ...updatedPost, status } : current
            );
            toast.success(`Đã chuyển bài viết sang ${statusLabels[status]}`);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không cập nhật được trạng thái bài viết');
        } finally {
            setUpdatingId(null);
        }
    };

    const openDetailModal = async (post) => {
        setSelectedPost(post);

        try {
            const response = await api.get(`/posts/${post.slug || getPostId(post)}`);
            setSelectedPost({ ...post, ...getPostData(response.data) });
        } catch (error) {
            console.error(error);
        }
    };

    const closeDetailModal = () => {
        setSelectedPost(null);
    };

    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý bài viết</div>
                    <div className={cx('subtitle')}>
                        Tạo, cập nhật, xem chi tiết, xóa và chuyển trạng thái draft/public cho bài viết.
                    </div>
                </div>

                <button className={cx('primaryBtn')} type="button" onClick={openCreateModal}>
                    Tạo bài viết
                </button>
            </div>

            <div className={cx('toolbar')}>
                <input
                    className={cx('input')}
                    type="search"
                    placeholder="Tìm theo tiêu đề, mô tả, slug"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                />
                <select
                    className={cx('select')}
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    {postStatuses.map((status) => (
                        <option key={status} value={status}>
                            {statusLabels[status]}
                        </option>
                    ))}
                </select>
            </div>

            <div className={cx('summary')}>
                <div>
                    <strong>{filteredPosts.length}</strong>
                    <span>Bài viết hiển thị</span>
                </div>
                <div>
                    <strong>{posts.filter((post) => normalizeStatus(post.status) === 'DRAFT').length}</strong>
                    <span>Draft</span>
                </div>
                <div>
                    <strong>{posts.filter((post) => normalizeStatus(post.status) === 'PUBLISHED').length}</strong>
                    <span>Public</span>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('tableWrap')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Bài viết</th>
                                <th>Trạng thái</th>
                                <th>Tạo lúc</th>
                                <th>Cập nhật</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="5">
                                        Đang tải danh sách bài viết...
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td className={cx('empty')} colSpan="5">
                                        Không có bài viết phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => {
                                    const postId = getPostId(post);
                                    const status = normalizeStatus(post.status);
                                    const thumbnail = post.coverImageUrl || post.thumbnail || post.coverImage || post.image;

                                    return (
                                        <tr key={postId}>
                                            <td>
                                                <div className={cx('postCell')}>
                                                    <div className={cx('thumb')}>
                                                        {thumbnail ? (
                                                            <img src={getImageUrl(thumbnail)} alt={post.title} />
                                                        ) : (
                                                            <span>{post.title?.slice(0, 1) || '?'}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <strong>{post.title}</strong>
                                                        <span>{post.excerpt || post.summary || post.slug || '-'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    className={cx('statusSelect', status.toLowerCase())}
                                                    value={status}
                                                    disabled={updatingId === postId}
                                                    onChange={(event) => handleStatusChange(post, event.target.value)}
                                                >
                                                    {postStatuses.map((item) => (
                                                        <option key={item} value={item}>
                                                            {statusLabels[item]}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{formatDate(post.createdAt)}</td>
                                            <td>{formatDate(post.updatedAt)}</td>
                                            <td>
                                                <div className={cx('rowActions')}>
                                                    <button type="button" onClick={() => openDetailModal(post)}>
                                                        Chi tiết
                                                    </button>
                                                    <button type="button" onClick={() => openEditModal(post)}>
                                                        Sửa
                                                    </button>
                                                    <button className={cx('danger')} type="button" onClick={() => handleDelete(post)}>
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpenModal && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('modalContent')}>
                        <div className={cx('modalHeader')}>
                            <h2>{editingPost ? 'Cập nhật bài viết' : 'Tạo bài viết mới'}</h2>
                            <button type="button" onClick={closeModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <form className={cx('form')} onSubmit={handleSubmit}>
                            <label>
                                Tiêu đề
                                <input name="title" required value={formData.title} onChange={handleInputChange} />
                            </label>

                            <label>
                                Mô tả ngắn
                                <input name="excerpt" value={formData.excerpt} onChange={handleInputChange} />
                            </label>

                            <div className={cx('formGrid')}>
                                <label>
                                    Ảnh đại diện
                                    <input
                                        name="coverImageUrl"
                                        placeholder="/uploads/posts/example.jpg"
                                        value={formData.coverImageUrl}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label>
                                    Trạng thái
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Public</option>
                                    </select>
                                </label>
                            </div>

                            <label>
                                Dòng giới thiệu
                                <input name="dek" required value={formData.dek} onChange={handleInputChange} />
                            </label>

                            <div className={cx('formGrid')}>
                                <label>
                                    Thời gian đọc
                                    <input
                                        name="readMinutes"
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.readMinutes}
                                        onChange={handleInputChange}
                                    />
                                </label>
                                <label className={cx('checkLabel')}>
                                    <input
                                        name="featured"
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                    />
                                    Bài viết nổi bật
                                </label>
                            </div>

                            <label>
                                Nội dung HTML
                                <textarea
                                    name="bodyHtml"
                                    rows="10"
                                    required
                                    value={formData.bodyHtml}
                                    onChange={handleInputChange}
                                />
                            </label>

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

            {selectedPost && (
                <div className={cx('modalOverlay')}>
                    <div className={cx('detailModal')}>
                        <div className={cx('modalHeader')}>
                            <div>
                                <h2>{selectedPost.title}</h2>
                                <span>{formatDate(selectedPost.updatedAt || selectedPost.createdAt)}</span>
                            </div>
                            <button type="button" onClick={closeDetailModal} aria-label="Đóng">
                                ×
                            </button>
                        </div>

                        <div className={cx('detailBody')}>
                            {(selectedPost.coverImageUrl || selectedPost.thumbnail || selectedPost.coverImage || selectedPost.image) && (
                                <img
                                    className={cx('cover')}
                                    src={getImageUrl(
                                        selectedPost.coverImageUrl ||
                                            selectedPost.thumbnail ||
                                            selectedPost.coverImage ||
                                            selectedPost.image
                                    )}
                                    alt={selectedPost.title}
                                />
                            )}

                            <div className={cx('detailMeta')}>
                                <span className={cx('badge', normalizeStatus(selectedPost.status).toLowerCase())}>
                                    {statusLabels[normalizeStatus(selectedPost.status)]}
                                </span>
                                {selectedPost.slug && <span>{selectedPost.slug}</span>}
                            </div>

                            {(selectedPost.excerpt || selectedPost.summary) && (
                                <p className={cx('excerpt')}>{selectedPost.excerpt || selectedPost.summary}</p>
                            )}

                            <div className={cx('content')}>{selectedPost.bodyHtml || selectedPost.content || selectedPost.body || '-'}</div>

                            <div className={cx('modalActions')}>
                                <select
                                    className={cx('statusSelect', normalizeStatus(selectedPost.status).toLowerCase())}
                                    value={normalizeStatus(selectedPost.status)}
                                    disabled={updatingId === getPostId(selectedPost)}
                                    onChange={(event) => handleStatusChange(selectedPost, event.target.value)}
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Public</option>
                                </select>
                                <button type="button" onClick={() => openEditModal(selectedPost)}>
                                    Sửa bài viết
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
