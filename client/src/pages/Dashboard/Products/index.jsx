import React from 'react';
import classNames from 'classnames/bind';

import styles from '../DashboardPage.module.scss';

const cx = classNames.bind(styles);

export default function Products() {
    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý sản phẩm</div>
                    <div className={cx('subtitle')}>Thêm mới, cập nhật, quản lý tồn kho và tìm kiếm sản phẩm.</div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('primaryBtn')} type="button">
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('muted')}>Bộ lọc/tìm kiếm và danh sách sản phẩm sẽ hiển thị tại đây.</div>
            </div>
        </div>
    );
}
