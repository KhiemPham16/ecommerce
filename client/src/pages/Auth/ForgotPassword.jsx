import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function ForgotPassword() {
    return (
        <form className={cx('form')} onSubmit={(e) => e.preventDefault()}>
            <p className={cx('note')}>Nhập email để nhận mã OTP đặt lại mật khẩu.</p>

            <div className={cx('field')}>
                <label className={cx('label')}>Email</label>
                <input className={cx('input')} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <button className={cx('button')} type="submit">
                Gửi OTP
            </button>

            <div className={cx('rowBetween')}>
                <Link className={cx('link')} to="/auth/login">
                    Quay lại đăng nhập
                </Link>
                <Link className={cx('link')} to="/auth/reset-password">
                    Tôi đã có OTP
                </Link>
            </div>
        </form>
    );
}
