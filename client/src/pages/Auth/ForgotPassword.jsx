import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import styles from './Auth.module.scss';
import classNames from 'classnames/bind';
import { useAuthStore } from '~/stores/useAuthStore';

const cx = classNames.bind(styles);

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword, loading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [sentEmail, setSentEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            toast.error('Vui lòng nhập email');
            return;
        }

        const success = await forgotPassword(trimmedEmail);

        if (success) {
            setSentEmail(trimmedEmail);
        }
    };

    const goToResetPassword = () => {
        const targetEmail = sentEmail || email.trim();
        navigate(`/auth/reset-password${targetEmail ? `?email=${encodeURIComponent(targetEmail)}` : ''}`);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <p className={cx('note')}>Nhập email để nhận mã OTP đặt lại mật khẩu.</p>

            <div className={cx('field')}>
                <label className={cx('label')}>Email</label>
                <input
                    className={cx('input')}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                />
            </div>

            {sentEmail && (
                <p className={cx('success')}>
                    OTP đã được gửi đến {sentEmail}. Vui lòng kiểm tra email và nhập mã trong 30 phút.
                </p>
            )}

            <button className={cx('button')} type="submit" disabled={loading}>
                {loading ? 'Đang gửi OTP...' : 'Gửi OTP'}
            </button>

            <div className={cx('rowBetween')}>
                <Link className={cx('link')} to="/auth/login">
                    Quay lại đăng nhập
                </Link>
                <button className={cx('textButton')} type="button" onClick={goToResetPassword}>
                    Tôi đã có OTP
                </button>
            </div>
        </form>
    );
}
