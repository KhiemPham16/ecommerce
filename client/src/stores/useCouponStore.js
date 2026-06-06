import { create } from 'zustand';
import { toast } from 'sonner';

import { couponService } from '~/services/couponService';

export const useCouponStore = create((set, get) => ({
    coupons: [],
    selectedCoupon: null,
    loading: false,
    saving: false,

    clearSelectedCoupon: () => set({ selectedCoupon: null }),

    fetchCoupons: async () => {
        try {
            set({ loading: true });
            const data = await couponService.getCoupons();
            set({ coupons: data.data || [] });
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được danh sách mã giảm giá');
            return false;
        } finally {
            set({ loading: false });
        }
    },

    fetchCouponDetail: async (id) => {
        try {
            set({ loading: true });
            const data = await couponService.getCouponById(id);
            set({ selectedCoupon: data.data || null });
            return data.data || null;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tải được chi tiết mã giảm giá');
            return null;
        } finally {
            set({ loading: false });
        }
    },

    createCoupon: async (payload) => {
        try {
            set({ saving: true });
            await couponService.createCoupon(payload);
            toast.success('Tạo mã giảm giá thành công');
            await get().fetchCoupons();
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không tạo được mã giảm giá');
            return false;
        } finally {
            set({ saving: false });
        }
    },

    updateCoupon: async (id, payload) => {
        try {
            set({ saving: true });
            await couponService.updateCoupon(id, payload);
            toast.success('Cập nhật mã giảm giá thành công');
            await get().fetchCoupons();
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không cập nhật được mã giảm giá');
            return false;
        } finally {
            set({ saving: false });
        }
    },

    deleteCoupon: async (id) => {
        try {
            await couponService.deleteCoupon(id);
            toast.success('Xóa mã giảm giá thành công');
            set((state) => ({
                coupons: state.coupons.filter((coupon) => coupon.id !== id),
                selectedCoupon: state.selectedCoupon?.id === id ? null : state.selectedCoupon
            }));
            return true;
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Không xóa được mã giảm giá');
            return false;
        }
    }
}));
