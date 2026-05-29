import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function ResetPassword() {
    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <p className={styles.note}>Nhập email + OTP + mật khẩu mới.</p>

            <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>OTP</label>
                <input className={styles.input} type="text" placeholder="123456" inputMode="numeric" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Mật khẩu mới</label>
                <input className={styles.input} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Nhập lại mật khẩu mới</label>
                <input className={styles.input} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <button className={styles.button} type="submit">
                Đặt lại mật khẩu
            </button>

            <p className={styles.note}>
                <Link className={styles.link} to="/auth/login">
                    Quay lại đăng nhập
                </Link>
            </p>
        </form>
    );
}