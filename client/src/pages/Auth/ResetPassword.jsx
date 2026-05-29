import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function ResetPassword() {
    return (
        <form className={cx('form')} onSubmit={(e) => e.preventDefault()}>
            <p className={cx('note')}>Nhập email + OTP + mật khẩu mới.</p>

            <div className={cx('field')}>
                <label className={cx('label')}>Email</label>
                <input className={cx('input')} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <div className={cx('field')}>
                <label className={cx('label')}>OTP</label>
                <input className={cx('input')} type="text" placeholder="123456" inputMode="numeric" />
            </div>

            <div className={cx('field')}>
                <label className={cx('label')}>Mật khẩu mới</label>
                <input className={cx('input')} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <div className={cx('field')}>
                <label className={cx('label')}>Nhập lại mật khẩu mới</label>
                <input className={cx('input')} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <button className={cx('button')} type="submit">
                Đặt lại mật khẩu
            </button>

            <p className={cx('note')}>
                <Link className={cx('link')} to="/auth/login">
                    Quay lại đăng nhập
                </Link>
            </p>
        </form>
    );
}
