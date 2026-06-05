import React from 'react';
import classNames from 'classnames/bind';
import { FaStar, FaRegHeart } from 'react-icons/fa';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

const categories = [
    {
        id: 1,
        name: 'Tiểu thuyết',
        count: '120+ sách',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        name: 'Kinh tế',
        count: '85+ sách',
        image: 'https://images.unsplash.com/photo-1612550761236-e813928f7271?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        name: 'Lịch sử',
        count: '60+ sách',
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 4,
        name: 'Công nghệ',
        count: '95+ sách',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 5,
        name: 'Tâm lý học',
        count: '70+ sách',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 6,
        name: 'Manga',
        count: '150+ sách',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60'
    }
];

const featuredBooks = [
    {
        id: 1,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        price: 79000,
        oldPrice: 99000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        price: 86000,
        oldPrice: 110000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        title: 'Lược Sử Loài Người',
        author: 'Yuval Noah Harari',
        price: 135000,
        oldPrice: 185000,
        rating: 4,
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 4,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 210000,
        oldPrice: 250000,
        rating: 5,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60'
    }
];

const blogs = [
    {
        id: 1,
        title: 'Top 5 cuốn sách thay đổi tư duy tài chính',
        desc: 'Khám phá những tựa sách gối đầu giường giúp bạn quản lý tài chính hiệu quả...',
        date: '25 Tháng 5, 2026',
        image: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 2,
        title: 'Hành trình khám phá lịch sử qua những trang sách',
        desc: 'Lịch sử không hề khô khan nếu bạn tiếp cận nó qua góc nhìn của những nhà văn lỗi lạc...',
        date: '20 Tháng 5, 2026',
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 3,
        title: 'Tại sao Manga ngày càng thu hút độc giả trưởng thành?',
        desc: 'Cốt truyện sâu sắc và nghệ thuật vẽ tranh đang đưa Manga lên một tầm cao mới...',
        date: '18 Tháng 5, 2026',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60'
    }
];

export default function Home() {
    return (
        <div className={cx('home-wrapper')}>
            <section className={cx('hero')}>
                <div className={cx('hero-content')}>
                    <span className={cx('hero-badge')}>Chào mừng đến với BookStory</span>
                    <h1 className={cx('hero-title')}>Khám Phá Thế Giới Qua Những Trang Sách Tinh Hoa</h1>
                    <p className={cx('hero-desc')}>
                        Tìm kiếm và sở hữu hàng ngàn tựa sách giá trị nhất thuộc mọi lĩnh vực với ưu đãi tốt nhất trong
                        tuần này.
                    </p>
                    <button className={cx('hero-btn')}>Mua ngay</button>
                </div>
                <div className={cx('hero-image-area')}>
                    <div className={cx('hero-image-wrapper')}>
                        <img
                            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
                            alt="Hero Books"
                        />
                    </div>
                </div>
            </section>

            <section className={cx('section')}>
                <div className={cx('section-header')}>
                    <h2>Danh Mục Sách Nổi Bật</h2>
                    <p>Tìm kiếm sách dễ dàng theo từng chủ đề yêu thích</p>
                </div>
                <div className={cx('category-grid')}>
                    {categories.map((cat) => (
                        <div key={cat.id} className={cx('category-card')}>
                            <div className={cx('cat-thumb')}>
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <div className={cx('cat-info')}>
                                <h3>{cat.name}</h3>
                                <p>{cat.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className={cx('bg-light')}>
                <section className={cx('section')}>
                    <div className={cx('section-header')}>
                        <h2>Sách Bán Chạy Trong Tuần</h2>
                        <p>Những tác phẩm tinh hoa đang được săn đón nhiều nhất</p>
                    </div>
                    <div className={cx('book-grid')}>
                        {featuredBooks.map((book) => (
                            <div key={book.id} className={cx('book-card')}>
                                <button className={cx('wishlist-btn')} aria-label="Wishlist">
                                    <FaRegHeart />
                                </button>
                                <div className={cx('book-thumb')}>
                                    <img src={book.image} alt={book.title} />
                                </div>
                                <div className={cx('book-info')}>
                                    <p className={cx('book-author')}>{book.author}</p>
                                    <h3 className={cx('book-title')}>{book.title}</h3>
                                    <div className={cx('book-rating')}>
                                        {[...Array(book.rating)].map((_, i) => (
                                            <FaStar key={i} className={cx('star')} />
                                        ))}
                                    </div>
                                    <div className={cx('book-price-row')}>
                                        <div className={cx('price-box')}>
                                            <span className={cx('price')}>{book.price.toLocaleString()}đ</span>
                                            <span className={cx('old-price')}>{book.oldPrice.toLocaleString()}đ</span>
                                        </div>
                                        <button className={cx('add-cart-btn')}>Thêm</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className={cx('promo-section')}>
                <div className={cx('promo-content')}>
                    <div className={cx('promo-badge')}>BIG SALE - 40%</div>
                    <h2>Tuần Lễ Vàng Đọc Sách</h2>
                    <p>
                        Đồng loạt giảm giá sâu cho toàn bộ tủ sách kỹ năng và công nghệ. Ưu đãi kết thúc sau vài giờ
                        nữa!
                    </p>
                    <button className={cx('promo-btn')}>Khám phá ngay</button>
                </div>
            </section>

            <section className={cx('section')}>
                <div className={cx('section-header')}>
                    <h2>Góc Độc Giả & Tin Tức</h2>
                    <p>Cập nhật xu hướng văn hóa đọc và các bài review sách chất lượng</p>
                </div>
                <div className={cx('blog-grid')}>
                    {blogs.map((blog) => (
                        <article key={blog.id} className={cx('blog-card')}>
                            <div className={cx('blog-thumb')}>
                                <img src={blog.image} alt={blog.title} />
                            </div>
                            <div className={cx('blog-info')}>
                                <span className={cx('blog-date')}>{blog.date}</span>
                                <h3>{blog.title}</h3>
                                <p>{blog.desc}</p>
                                <a href="#read" className={cx('blog-link')}>
                                    Đọc tiếp
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
