import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function AuthLayout() {
    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Tài khoản</h1>
                    <p className={styles.subtitle}>Đăng nhập hoặc tạo tài khoản để tiếp tục.</p>
                </div>

                <div className={styles.tabs}>
                    <NavLink
                        to="/auth/login"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
                    >
                        Đăng nhập
                    </NavLink>

                    <NavLink
                        to="/auth/register"
                        className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
                    >
                        Đăng ký
                    </NavLink>
                </div>

                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}