import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function Login() {
    return (
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" placeholder="you@example.com" autoComplete="email" />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Mật khẩu</label>
                <input className={styles.input} type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>

            <button className={styles.button} type="submit">
                Đăng nhập
            </button>

            <div className={styles.rowBetween}>
                <Link className={styles.link} to="/auth/forgot-password">
                    Quên mật khẩu?
                </Link>

                <Link className={styles.link} to="/auth/register">
                    Tạo tài khoản
                </Link>
            </div>
        </form>
    );
}