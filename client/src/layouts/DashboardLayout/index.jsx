import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.scss';

const cx = classNames.bind(styles);

function getPageTitle(pathname) {
    if (pathname === '/dashboard') return 'Tổng quan';
    if (pathname.startsWith('/dashboard/employees')) return 'Nhân viên';
    if (pathname.startsWith('/dashboard/customers')) return 'Khách hàng';
    if (pathname.startsWith('/dashboard/products')) return 'Sản phẩm';
    if (pathname.startsWith('/dashboard/categories')) return 'Danh mục';
    if (pathname.startsWith('/dashboard/orders')) return 'Đơn hàng';
    if (pathname.startsWith('/dashboard/blogs')) return 'Bài viết';
    if (pathname.startsWith('/dashboard/media')) return 'Media';
    if (pathname.startsWith('/dashboard/coupons')) return 'Mã giảm giá';
    if (pathname.startsWith('/dashboard/payment-methods')) return 'Phương thức thanh toán';
    return 'Dashboard';
}

export default function DashboardLayout() {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className={cx('layout')}>
            <Sidebar />

            <main className={cx('content')}>
                <div className={cx('contentInner')}>
                    <div className={cx('topbar')}>
                        <div>
                            <div className={cx('pageTitle')}>{pageTitle}</div>
                            <div className={cx('breadcrumb')}>{location.pathname}</div>
                        </div>
                    </div>

                    <Outlet />
                </div>
            </main>
        </div>
    );
}
