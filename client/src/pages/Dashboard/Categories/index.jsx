import React from 'react';
import classNames from 'classnames/bind';

import styles from '../DashboardPage.module.scss';

const cx = classNames.bind(styles);

export default function Categories() {
    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý danh mục</div>
                    <div className={cx('subtitle')}>Thêm mới, cập nhật, xóa và xem danh sách danh mục sản phẩm.</div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('primaryBtn')} type="button">
                        Thêm danh mục
                    </button>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('muted')}>Danh sách danh mục sẽ hiển thị tại đây.</div>
            </div>
        </div>
    );
}
