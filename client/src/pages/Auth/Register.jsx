import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function Register() {
    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
                <label className={styles.label}>Họ và tên</label>
                <input className={styles.input} type="text" placeholder="Nguyễn Văn A" autoComplete="name" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Số điện thoại</label>
                <input className={styles.input} type="tel" placeholder="0xxxxxxxxx" autoComplete="tel" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Mật khẩu</label>
                <input className={styles.input} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Nhập lại mật khẩu</label>
                <input className={styles.input} type="password" placeholder="••••••••" autoComplete="new-password" />
            </div>

            <button className={styles.button} type="submit">
                Đăng ký
            </button>

            <p className={styles.note}>
                Đã có tài khoản?{' '}
                <Link className={styles.link} to="/auth/login">
                    Đăng nhập
                </Link>
            </p>

            <p className={styles.note}>
                Sau khi đăng ký, hãy kiểm tra email để xác thực tài khoản.
            </p>
        </form>
    );
}