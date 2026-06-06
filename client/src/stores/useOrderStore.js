import { create } from 'zustand';
import { toast } from 'sonner';

import { orderStatusLabels } from '~/lib/dashboardUtils';
import { orderService } from '~/services/orderService';

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    updatingId: null,

    fetchOrders: async () => {
        try {
            set({ loading: true });
            const data = await orderService.getOrders();
            set({ orders: data.data || [] });
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách đơn hàng');
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateOrderStatus: async (order, status) => {
        if (!status || order.status === status) {
            return false;
        }

        try {
            set({ updatingId: order.id });
            const data = await orderService.updateOrderStatus(order.id, status);
            const updatedOrder = data.data;

            set((state) => ({
                orders: state.orders.map((item) =>
                    item.id === order.id
                        ? {
                              ...item,
                              ...updatedOrder,
                              user: item.user,
                              address: item.address
                          }
                        : item
                )
            }));

            toast.success(`Đã chuyển đơn hàng sang "${orderStatusLabels[status]}"`);
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không cập nhật được trạng thái đơn hàng');
            return false;
        } finally {
            set({ updatingId: null });
        }
    }
}));
