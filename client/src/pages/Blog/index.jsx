import React from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng useNavigate để khi click vào bài viết sẽ chuyển trang mượt mà
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';

const cx = classNames.bind(styles);

const DUMMY_POSTS = [
  {
    id: 'top-10-sach-tu-duy',
    title: 'Top 10 cuốn sách tư duy thay đổi cuộc đời bạn trong năm 2026',
    desc: 'Khám phá những tựa sách giúp bạn thay đổi tư duy, rèn luyện kỹ năng và bứt phá mạnh mẽ hơn trong công việc và cuộc sống...',
    date: '03/06/2026',
    thumb: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    category: 'Tư duy - Kỹ năng'
  },
  {
    id: 'duy-tri-thoi-quen-doc-sach',
    title: 'Làm thế nào để duy trì thói quen đọc sách 30 phút mỗi ngày?',
    desc: 'Đọc sách là một thói quen tốt nhưng không phải ai cũng biết cách duy trì nó giữa nhịp sống bận rộn hiện đại...',
    date: '01/06/2026',
    thumb: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=600&auto=format&fit=crop',
    category: 'Chia sẻ'
  },
  {
    id: 'review-sach-kinh-te-vi-mo',
    title: 'Review sách Kinh Tế Vĩ Mô: Những bài học đắt giá cho khởi nghiệp',
    desc: 'Cuốn sách cung cấp cái nhìn toàn diện về bức tranh kinh tế toàn cầu và những ứng dụng thực tế cực kỳ đắt giá...',
    date: '28/05/2026',
    thumb: 'https://images.unsplash.com/photo-1592492159418-09f31333c516?q=80&w=600&auto=format&fit=crop',
    category: 'Sách Kinh Tế'
  }
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className={cx('blog-wrapper')}>
      <div className={cx('container')}>
        {/* Tiêu đề trang */}
        <div className={cx('blog-header')}>
          <h1>Bài Viết Mới Nhất</h1>
          <p>Cập nhật tin tức, review sách và những kiến thức bổ ích mỗi ngày.</p>
        </div>

        {/* Danh sách bài viết dạng Grid */}
        <div className={cx('blog-grid')}>
          {DUMMY_POSTS.map((post) => (
            <article key={post.id} className={cx('blog-card')}>
              <div className={cx('thumb')}>
                <img src={post.thumb} alt={post.title} />
                <span className={cx('category-tag')}>{post.category}</span>
              </div>
              <div className={cx('info')}>
                <span className={cx('date')}>{post.date}</span>
                <h2 className={cx('title')}>{post.title}</h2>
                <p className={cx('desc')}>{post.desc}</p>
                
                {/* Khi click vào nút "Đọc thêm", React Router sẽ chuyển sang bài viết chi tiết */}
                <button 
                  onClick={() => navigate(`/blog/${post.id}`)} 
                  className={cx('btn-readmore')}
                >
                  Đọc thêm &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}