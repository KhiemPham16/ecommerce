import React from 'react'
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <div>
        <div className={styles.headerTop}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.search}>
                <input type="text" placeholder="Sách lịch sử..." />
                <button>Search</button>
            </div>
            <div className={styles.cart}>Cart</div>
            <div className={styles.user}>User</div>
        </div>
        <nav className={styles.nav}>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/auth/login">Đăng nhập</Link></li>
            </ul>
        </nav>   
    </div>
  )
}
