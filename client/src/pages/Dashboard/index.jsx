import React from 'react';
import classNames from 'classnames/bind';

import pageStyles from './DashboardPage.module.scss';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);
const cp = classNames.bind(pageStyles);

export default function Dashboard1() {

  return (
    <div className={cp('page')}>
      <div className={cp('header')}>
        <div>
          <div className={cp('title')}>Tổng quan</div>
          <div className={cp('subtitle')}>Xem nhanh tình trạng hệ thống và các mục cần xử lý.</div>
        </div>

        <div className={cp('actions')}>
          <button className={cp('secondaryBtn')} type="button">
            Làm mới
          </button>
        </div>
      </div>

      <div className={cx('quickGrid')}>
        <div className={cx('quickCard')}>
          <div className={cx('quickTitle')}>Đơn hàng hôm nay</div>
          <div className={cx('quickValue')}>—</div>
          <div className={cx('quickHint')}>Sẽ hiển thị khi nối API Orders.</div>
        </div>
        <div className={cx('quickCard')}>
          <div className={cx('quickTitle')}>Sản phẩm đang bán</div>
          <div className={cx('quickValue')}>—</div>
          <div className={cx('quickHint')}>Sẽ hiển thị khi nối API Products.</div>
        </div>
        <div className={cx('quickCard')}>
          <div className={cx('quickTitle')}>Khách hàng</div>
          <div className={cx('quickValue')}>—</div>
          <div className={cx('quickHint')}>Sẽ hiển thị khi nối API Users.</div>
        </div>
      </div>

      <div className={cp('grid2')}>
        <div className={cx('sectionCard')}>
          <div className={cx('sectionTitle')}>Việc cần xử lý</div>
          <div className={cx('list')}>
            <div className={cx('listItem')}>
              <div>
                <div className={cx('itemTitle')}>Đơn hàng chờ xác nhận</div>
                <div className={cx('itemMeta')}>Kiểm tra và cập nhật trạng thái đơn hàng.</div>
              </div>
              <div className={cx('itemMeta')}>—</div>
            </div>
            <div className={cx('listItem')}>
              <div>
                <div className={cx('itemTitle')}>Sản phẩm sắp hết hàng</div>
                <div className={cx('itemMeta')}>Theo dõi tồn kho để nhập thêm kịp thời.</div>
              </div>
              <div className={cx('itemMeta')}>—</div>
            </div>
          </div>
        </div>

        <div className={cx('sectionCard')}>
          <div className={cx('sectionTitle')}>Gợi ý thao tác</div>
          <div className={cx('list')}>
            <div className={cx('listItem')}>
              <div>
                <div className={cx('itemTitle')}>Thêm sản phẩm mới</div>
                <div className={cx('itemMeta')}>Cập nhật dữ liệu sản phẩm để hiển thị trên trang bán hàng.</div>
              </div>
              <div className={cx('itemMeta')}>Products</div>
            </div>
            <div className={cx('listItem')}>
              <div>
                <div className={cx('itemTitle')}>Cập nhật danh mục</div>
                <div className={cx('itemMeta')}>Sắp xếp danh mục giúp khách hàng tìm kiếm dễ hơn.</div>
              </div>
              <div className={cx('itemMeta')}>Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
