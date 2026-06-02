import React from 'react';
import classNames from 'classnames/bind';

import styles from '../DashboardPage.module.scss';

const cx = classNames.bind(styles);

export default function Orders() {
    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý đơn hàng</div>
                    <div className={cx('subtitle')}>Xem danh sách, chi tiết, xác nhận và hủy đơn hàng.</div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('secondaryBtn')} type="button">
                        Lọc
                    </button>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('muted')}>Danh sách đơn hàng sẽ hiển thị tại đây.</div>
            </div>
        </div>
    );
}
