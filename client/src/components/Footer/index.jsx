import React from 'react'
import classNames from 'classnames/bind'
import { 
FaFacebook, FaInstagram, FaTwitter, FaYoutube 
} from 'react-icons/fa';
import styles from './Footer.module.scss'

const cx =classNames.bind(styles);
export default function Footer() {
  return (
    <div>
      <footer className={cx('footer')}>
        <div className={cx('footer-container')}>
          <div className={cx('footer-column')}>
            <div className={cx('footer-logo')}>BOOK<span className={cx('logo-accent')}>STORY</span></div>
            <p className={cx('footer-desc')}>Nơi hội tụ tri thức nhân loại. Mang lại những trải nghiệm mua sắm hiện đại và chuyên nghiệp.</p>
            <div className={cx('footer-socials')}>
              <a href="#fb"><FaFacebook /></a>
              <a href="#ig"><FaInstagram /></a>
              <a href="#tw"><FaTwitter /></a>
              <a href="#yt"><FaYoutube /></a>
            </div>
          </div>
          <div className={cx('footer-column')}>
            <h3>Liên kết nhanh</h3>
            <ul>
              <li><a href="#about">Về chúng tôi</a></li>
              <li><a href="#products">Tất cả sản phẩm</a></li>
              <li><a href="#blog">Bài viết mới</a></li>
            </ul>
          </div>
          <div className={cx('footer-column')}>
            <h3>Hỗ trợ</h3>
            <ul>
              <li><a href="#shipping">Vận chuyển</a></li>
              <li><a href="#returns">Đổi trả hàng</a></li>
              <li><a href="#privacy">Bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className={cx('footer-bottom')}>
          <p>&copy; 2026 BookStory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
