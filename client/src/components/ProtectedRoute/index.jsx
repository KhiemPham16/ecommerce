import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '~/stores/useAuthStore';

export default function ProtectedRoute() {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
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
        return <div>Đang tải trang...</div>;
    }

    if (!accessToken && !useAuthStore.getState().accessToken) {
        return <Navigate to="/auth/login" replace />;
    }

    return <Outlet />;
}
