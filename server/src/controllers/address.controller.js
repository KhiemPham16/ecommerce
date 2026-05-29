const addressService = require('~/services/address.service');

class AddressController {
    async me(req, res, next) {
        try {
            const address = await addressService.getMyAddress(req.user._id);

            return res.status(200).json({
                success: true,
                data: address
            });
        } catch (error) {
            next(error);
        }
    }

    async upsertMe(req, res, next) {
        try {
            const address = await addressService.upsertMyAddress(req.user._id, req.body);

            return res.status(200).json({
                success: true,
                message: 'Lưu địa chỉ thành công',
                data: address
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AddressController();
