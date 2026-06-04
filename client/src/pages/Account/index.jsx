import React from 'react';
import { Link } from 'react-router-dom';

import { useAuthStore } from '~/stores/useAuthStore';

export default function Account() {
	const { user } = useAuthStore();

	return (
		<div style={{ padding: 24 }}>
			<h2>Profile</h2>
			<div>
				<div>
					<strong>Họ tên:</strong> {user?.fullName || '-'}
				</div>
				<div>
					<strong>Email:</strong> {user?.email || '-'}
				</div>
			</div>

			<div style={{ marginTop: 12 }}>
				<Link to="/account/orders">Xem lịch sử mua hàng</Link>
			</div>
		</div>
	);
}

