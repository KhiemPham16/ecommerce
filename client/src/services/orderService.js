import { axiosInstance as api } from '~/lib/axios';

export const orderService = {
    getOrders: async () => {
        const res = await api.get('/orders');
        return res.data;
    },

    updateOrderStatus: async (id, status) => {
        const res = await api.patch(`/orders/${id}/status`, { status });
        return res.data;
    }
};
