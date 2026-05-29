import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Auth.module.scss';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    return (
        <div className={styles.form}>
            <p className={styles.note}>
                {token ? 'Đang chuẩn bị xác thực email…' : 'Thiếu token xác thực.'}
            </p>

            <div className={styles.rowBetween}>
                <Link className={styles.link} to="/auth/login">
                    Về đăng nhập
                </Link>
                <Link className={styles.link} to="/auth/register">
                    Tạo tài khoản
                </Link>
            </div>
        </div>
    );
}