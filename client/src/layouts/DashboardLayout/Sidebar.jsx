import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import { useAuthStore } from '~/stores/useAuthStore';

import styles from './DashboardLayout.module.scss';

const cx = classNames.bind(styles);

function SidebarLink({ to, children, end = false }) {
    return (
        <NavLink to={to} end={end} className={({ isActive }) => cx('navItem', { navItemActive: isActive })}>
            {children}
        </NavLink>
    );
}

export default function Sidebar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const title = useMemo(() => {
        if (location.pathname.startsWith('/dashboard/employees')) return 'Quản lý nhân viên';
        if (location.pathname.startsWith('/dashboard/customers')) return 'Quản lý khách hàng';
        if (location.pathname.startsWith('/dashboard/products')) return 'Quản lý sản phẩm';
        if (location.pathname.startsWith('/dashboard/categories')) return 'Quản lý danh mục';
        if (location.pathname.startsWith('/dashboard/orders')) return 'Quản lý đơn hàng';
        if (location.pathname.startsWith('/dashboard/blogs')) return 'Quản lý bài viết';
        if (location.pathname.startsWith('/dashboard/media')) return 'Quản lý media';
        if (location.pathname.startsWith('/dashboard/coupons')) return 'Quản lý mã giảm giá';
        if (location.pathname.startsWith('/dashboard/payment-methods')) return 'Quản lý phương thức thanh toán';
        return 'Tổng quan';
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <aside className={cx('sidebar')}>
            <div className={cx('brand')}>
                <div className={cx('brandTitle')}>Dashboard</div>
                <div className={cx('brandSubtitle')}>{title}</div>
            </div>

            <nav className={cx('nav')}>
                <SidebarLink to="/dashboard" end>
                    Tổng quan
                </SidebarLink>
                <SidebarLink to="/dashboard/employees">Nhân viên</SidebarLink>
                <SidebarLink to="/dashboard/products">Sản phẩm</SidebarLink>
                <SidebarLink to="/dashboard/categories">Danh mục</SidebarLink>
                <SidebarLink to="/dashboard/customers">Khách hàng</SidebarLink>
                <SidebarLink to="/dashboard/orders">Đơn hàng</SidebarLink>
                <SidebarLink to="/dashboard/blogs">Bài viết</SidebarLink>
                <SidebarLink to="/dashboard/media">Media</SidebarLink>
                <SidebarLink to="/dashboard/coupons">Mã giảm giá</SidebarLink>
                <SidebarLink to="/dashboard/payment-methods">Phương thức thanh toán</SidebarLink>
            </nav>

            <div className={cx('sidebarFooter')}>
                <div className={cx('userLine')}>
                    {user ? (
                        <>
                            {user.fullName} ({user.role})
                        </>
                    ) : (
                        'Chưa đăng nhập'
                    )}
                </div>

                <button className={cx('logoutBtn')} type="button" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}
