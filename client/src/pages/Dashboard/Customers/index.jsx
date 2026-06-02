import React from 'react';
import classNames from 'classnames/bind';

import styles from '../DashboardPage.module.scss';

const cx = classNames.bind(styles);

export default function Customers() {
    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý khách hàng</div>
                    <div className={cx('subtitle')}>Xem danh sách, tìm kiếm và theo dõi lịch sử mua hàng.</div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('primaryBtn')} type="button">
                        Thêm khách hàng
                    </button>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('muted')}>Danh sách khách hàng sẽ hiển thị tại đây.</div>
            </div>
        </div>
    );
}
