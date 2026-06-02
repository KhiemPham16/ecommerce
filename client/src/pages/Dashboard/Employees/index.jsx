import React from 'react';
import classNames from 'classnames/bind';

import styles from '../DashboardPage.module.scss';

const cx = classNames.bind(styles);

export default function Employees() {
    return (
        <div className={cx('page')}>
            <div className={cx('header')}>
                <div>
                    <div className={cx('title')}>Quản lý nhân viên</div>
                    <div className={cx('subtitle')}>Thêm mới, cập nhật, phân quyền và quản lý tài khoản nhân viên.</div>
                </div>

                <div className={cx('actions')}>
                    <button className={cx('primaryBtn')} type="button">
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className={cx('card')}>
                <div className={cx('muted')}>Danh sách nhân viên sẽ hiển thị tại đây.</div>
            </div>
        </div>
    );
}
