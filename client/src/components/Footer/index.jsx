import React from 'react';
import classNames from 'classnames/bind';
import { FaFacebook, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

export default function Footer() {
  return (
    <footer className={cx('footer')}>
      {/* Thanh ngang tiện ích phía trên đầu */}
      <div className={cx('footer-top-bar')}>
        <div className={cx('top-bar-container')}>
          <span>Miễn phí trả nhanh chóng</span>
          <span>100% sách có bản quyền</span>
          <span>Giao hàng toàn quốc</span>
          <span>Quà tặng cho đơn hàng***</span>
        </div>
      </div>

      {/* Grid chia 4 cột nội dung chính bên dưới */}
      <div className={cx('footer-container')}>
        {/* Cột 1: Logo */}
        <div className={cx('footer-column', 'col-logo')}>
          <div className={cx('footer-logo')}>
            Book<span className={cx('logo-accent')}>STORY</span>
          </div>
          <p className={cx('footer-desc')}>
            Không gian lan tỏa tri thức, mang đến những cuốn sách chất lượng nhất tinh hoa nhất cho độc giả.
          </p>
        </div>

        {/* Cột 2: Hỗ trợ khách hàng */}
        <div className={cx('footer-column')}>
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li><a href="/chinh-sach-bao-mat">&gt; Chính sách bảo mật</a></li>
            <li><a href="/huong-dan-mua-hang">&gt; Hướng dẫn mua hàng</a></li>
            <li><a href="/chinh-sach-doi-tra">&gt; Chính sách đổi trả</a></li>
            <li><a href="/chinh-sach-si">&gt; Chính sách sỉ</a></li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className={cx('footer-column')}>
          <h3>Liên hệ</h3>
          <div className={cx('footer-socials')}>
            <a href="tel:0123456789"><FaPhoneAlt /> Hotline</a>
          </div>
          <div className={cx('footer-socials')} style={{ marginTop: '14px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook /> Facebook</a>
          </div>
          <div className={cx('footer-socials')} style={{ marginTop: '14px' }}>
            <a href="mailto:contact@bookstory.com"><FaEnvelope /> Email</a>
          </div>
        </div>

        {/* Cột 4: Danh mục */}
        <div className={cx('footer-column')}>
          <h3>Danh mục</h3>
          <ul>
            <li><a href="/category/tu-duy">&gt; Sách tư duy - kĩ năng</a></li>
            <li><a href="/category/kinh-te">&gt; Sách kinh tế</a></li>
            <li><a href="/category/lich-su">&gt; Sách lịch sử</a></li>
          </ul>
        </div>
      </div>

      {/* Dòng chữ bản quyền ở đáy dưới cùng */}
      <div className={cx('footer-bottom')}>
        <p>&copy; 2026 BookSTORY. All rights reserved.</p>
      </div>
    </footer>
  );
}