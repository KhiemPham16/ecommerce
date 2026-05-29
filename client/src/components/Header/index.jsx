import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';

import { useAuthStore } from '~/stores/useAuthStore';

const cx = classNames.bind(styles);

export default function Header() {
    const { accessToken, user, fetchMe, logout } = useAuthStore();

    useEffect(() => {
        if (accessToken && !user) {
            fetchMe();
        }
    }, [accessToken, user]);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div>
            <div className={cx('headerTop')}>
                <div className={cx('logo')}>Logo</div>

                <div className={cx('search')}>
                    <input type="text" placeholder="Sách lịch sử..." />
                    <button>Search</button>
                </div>

                <div className={cx('cart')}>Cart</div>

                <div className={cx('user')}>
                    {user ? (
                        <>
                            <span className={cx('userName')}>{user.fullName}</span>

                            <button className={cx('logoutBtn')} type="button" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link className={cx('accountLink')} to="/auth/login">
                            Tài khoản
                        </Link>
                    )}
                </div>
            </div>

            <nav className={cx('nav')}>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="/blog">Blog</Link>
                    </li>

                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
