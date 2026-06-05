import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';

import { useAuthStore } from '~/stores/useAuthStore';

const cx = classNames.bind(styles);

export default function Header() {
    const { accessToken, user, fetchMe, logout } = useAuthStore();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    useEffect(() => {
        if (accessToken && !user) {
            fetchMe();
        }
    }, [accessToken, user, fetchMe]);

    useEffect(() => {
        if (!userMenuOpen) return;

        const onMouseDown = (event) => {
            if (!userMenuRef.current) return;
            if (!userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [userMenuOpen]);

    const displayName = useMemo(() => {
        return user?.fullName || user?.email || 'User';
    }, [user]);

    const handleLogout = async () => {
        setUserMenuOpen(false);
        await logout();
    };

    return (
        <div className={cx('header')}>
            <div className={cx('headerTop')}>
                <div className={cx('headerTopLeft')}>
                    <div className={cx('logo')}>Logo</div>

                    <div className={cx('search')}>
                        <input type="text" placeholder="Sách lịch sử..." />
                        <button>Search</button>
                    </div>
                </div>

                <div className={cx('headerTopRight')}>
                    <div className={cx('cart')}>Cart</div>

                    <div className={cx('user')}>
                        {user ? (
                            <div className={cx('userDropdown')} ref={userMenuRef}>
                                <button
                                    className={cx('userTrigger')}
                                    type="button"
                                    onClick={() => setUserMenuOpen((prev) => !prev)}
                                    aria-haspopup="menu"
                                    aria-expanded={userMenuOpen}
                                >
                                    <span className={cx('userName')}>{displayName}</span>
                                    <span className={cx('userChevron')} aria-hidden="true">
                                        ▾
                                    </span>
                                </button>

                                {userMenuOpen && (
                                    <div className={cx('userMenu')} role="menu">
                                        <Link
                                            className={cx('userMenuItem')}
                                            to="/account"
                                            role="menuitem"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            className={cx('userMenuItem')}
                                            to="/account/orders"
                                            role="menuitem"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            Lịch sử mua hàng
                                        </Link>
                                        <button
                                            className={cx('userMenuItem', 'userMenuButton')}
                                            type="button"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link className={cx('accountLink')} to="/auth/login">
                                Tài khoản
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <nav className={cx('nav')}>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>

                    <li>
                        <Link to="/category">Category</Link>
                    </li>

                    <li>
                        <Link to="/blog">Blog</Link>
                    </li>

                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                        {user && ['ADMIN', 'MANAGER'].includes(user.role) && <Link to="/dashboard">Dashboard</Link>}
                    </li>
                </ul>
            </nav>
        </div>
    );
}
