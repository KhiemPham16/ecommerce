import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '~/stores/useAuthStore';

export default function ProtectedRoute({ allowedRoles = [] }) {
    const { loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    useEffect(() => {
        const init = async () => {
            let token = useAuthStore.getState().accessToken;

            if (!token) {
                await refresh();
                token = useAuthStore.getState().accessToken;
            }

            const currentUser = useAuthStore.getState().user;

            if (token && !currentUser) {
                await fetchMe();
            }

            setStarting(false);
        };

        init();
    }, [refresh, fetchMe]);

    if (starting || loading) {
        return <div>chỉ cho phép người quản trị sử dụng tính năng này...</div>;
    }

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken) {
        return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}