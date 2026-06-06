import React, { useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useSearchParams } from 'react-router-dom';

import { FaStar, FaFilter } from 'react-icons/fa';
import styles from './Category.module.scss';

const cx = classNames.bind(styles);

const genres = ['Tất cả sách', 'Tiểu thuyết', 'Kinh tế', 'Lịch sử', 'Công nghệ', 'Tâm lý học', 'Manga'];

const allBooks = [
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

export default function Category() {
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get('search')?.trim() || '';
    const [selectedGenre, setSelectedGenre] = useState('Tất cả sách');

    const filteredBooks = useMemo(() => {
        const keyword = searchKeyword.toLowerCase();

        return allBooks.filter((book) => {
            const matchesGenre = selectedGenre === 'Tất cả sách' || book.genre === selectedGenre;
            const matchesKeyword =
                !keyword ||
                [book.title, book.genre].filter(Boolean).some((value) => value.toLowerCase().includes(keyword));

            return matchesGenre && matchesKeyword;
        });
    }, [searchKeyword, selectedGenre]);

    const heading = searchKeyword ? `Kết quả tìm kiếm: "${searchKeyword}"` : selectedGenre;

    return (
        <div className={cx('category-wrapper')}>
            <div className={cx('container')}>
                <aside className={cx('sidebar')}>
                    <h2 className={cx('sidebar-title')}>
                        <FaFilter /> Bộ lọc sách
                    </h2>
                    <ul className={cx('genre-list')}>
                        {genres.map((genre) => (
                            <li
                                key={genre}
                                className={cx('genre-item', { active: selectedGenre === genre })}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className={cx('content')}>
                    <div className={cx('content-header')}>
                        <h1>{heading}</h1>
                        <p>Tìm thấy {filteredBooks.length} cuốn sách phù hợp</p>
                    </div>

                    <div className={cx('products-grid')}>
                        {filteredBooks.map((book) => (
                            <Link key={book.id} to={`/product/${book.slug}`} className={cx('product-card')}>
                                <div className={cx('thumb')}>
                                    <img src={book.image} alt={book.title} />
                                </div>

                                <div className={cx('info')}>
                                    <span className={cx('tag')}>{book.genre}</span>
                                    <h3 className={cx('title')}>{book.title}</h3>

                                    <div className={cx('rating')}>
                                        {[...Array(book.rating)].map((_, i) => (
                                            <FaStar key={i} className={cx('star')} />
                                        ))}
                                    </div>

                                    <div className={cx('price-row')}>
                                        <span className={cx('price')}>{book.price.toLocaleString()}đ</span>
                                        <button className={cx('btn-add')} type="button">
                                            Mua
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
