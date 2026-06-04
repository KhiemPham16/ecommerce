import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AuthLayout from './pages/Auth';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Category from './pages/Category';
import Account from './pages/Account';
import AccountOrders from './pages/Account/Orders';

import SiteLayout from '~/layouts/SiteLayout';
import DashboardLayout from '~/layouts/DashboardLayout';
import ProtectedRoute from '~/components/ProtectedRoute';

import Dashboard from '~/pages/Dashboard';
import Employees from '~/pages/Dashboard/Employees';
import Customers from '~/pages/Dashboard/Customers';
import Products from '~/pages/Dashboard/Products';
import Categories from '~/pages/Dashboard/Categories';
import Orders from '~/pages/Dashboard/Orders';
export default function App() {
    return (
        <Routes>
            <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category" element={<Category />} />
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgot-password" element={<ForgotPassword />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                </Route>
                <Route path="/api/v1/auth/verify-email" element={<VerifyEmail />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<SiteLayout />}>
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/orders" element={<AccountOrders />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="orders" element={<Orders />} />
                </Route>
            </Route>
        </Routes>
    );
}
