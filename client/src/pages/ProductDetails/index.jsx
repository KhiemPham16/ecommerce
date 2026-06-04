import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { FaStar, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import styles from './ProductDetails.module.scss';

const cx = classNames.bind(styles);

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  return (
    <div className={cx('detail-wrapper')}>
      <div className={cx('container')}>
        
        {/* Phần thông tin chính ở trên */}
        <div className={cx('main-info')}>
          {/* Cột trái: Ảnh sản phẩm */}
          <div className={cx('image-column')}>
            <div className={cx('main-image')}>
              <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop" alt="Tên sách" />
            </div>
          </div>

          {/* Cột phải: Thông tin bán hàng */}
          <div className={cx('content-column')}>
            <span className={cx('tag')}>Sách bán chạy</span>
            <h1 className={cx('product-title')}>Đắc Nhân Tâm (Bản Đặc Biệt Thời Đại Mới)</h1>
            
            <div className={cx('rating-row')}>
              <div className={cx('stars')}>
                <FaStar/><FaStar/><FaStar/><FaStar/><FaStar/>
              </div>
              <span className={cx('reviews-count')}>(45 đánh giá của khách hàng)</span>
            </div>

            <div className={cx('price-box')}>
              <span className={cx('current-price')}>120.000đ</span>
              <span className={cx('old-price')}>150.000đ</span>
            </div>

            <p className={cx('short-desc')}>
              Tác phẩm kinh điển đưa ra các lời khuyên về cách thức giao tiếp và ứng xử với mọi người để đạt được thành công trong cuộc sống.
            </p>

            <div className={cx('status-row')}>
              <FaCheckCircle className={cx('icon-check')} />
              <span>Tình trạng: <strong>Còn hàng</strong></span>
            </div>

            {/* Bộ tăng giảm số lượng & Nút chọn mua */}
            <div className={cx('action-row')}>
              <div className={cx('quantity-selector')}>
                <button onClick={() => handleQuantityChange('dec')}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange('inc')}>+</button>
              </div>

              <button className={cx('btn-add-cart')}>
                <FaShoppingCart /> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Phần mô tả chi tiết sản phẩm ở dưới */}
        <div className={cx('detail-description')}>
          <h2>Giới Thiệu Nội Dung Chi Tiết</h2>
          <div className={cx('desc-content')}>
            <p>
              "Đắc Nhân Tâm" của Dale Carnegie là cuốn sách nổi tiếng nhất, có tầm ảnh hưởng rộng lớn nhất mọi thời đại. Tác phẩm đã được dịch ra hầu hết các thứ tiếng trên thế giới và có mặt ở hàng trăm quốc gia.
            </p>
            <p>
              Cuốn sách đưa ra những nguyên tắc vàng trong việc thu phục lòng người, giúp bạn xây dựng mối quan hệ bền vững, tạo dựng niềm tin và nhận được sự hợp tác từ đồng nghiệp, đối tác lẫn những người xung quanh. Bản cập nhật mới bổ sung các ví dụ thực tế phù hợp với môi trường làm việc và giao tiếp hiện đại.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}