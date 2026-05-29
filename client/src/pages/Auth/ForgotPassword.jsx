import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function ForgotPassword() {
    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <p className={styles.note}>
                Nhập email để nhận mã OTP đặt lại mật khẩu.
            </p>

            <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <button className={styles.button} type="submit">
                Gửi OTP
            </button>

            <div className={styles.rowBetween}>
                <Link className={styles.link} to="/auth/login">
                    Quay lại đăng nhập
                </Link>
                <Link className={styles.link} to="/auth/reset-password">
                    Tôi đã có OTP
                </Link>
            </div>
        </form>
    );
}