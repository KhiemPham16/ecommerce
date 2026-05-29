const Address = require('~/models/address.model');

class AddressService {
    async getMyAddress(userId) {
        return Address.findOne({
            userId,
            deletedAt: null
        });
    }

    async upsertMyAddress(userId, data) {
        const { receiverName, receiverPhone, provinceCity, ward, specificAddress } = data;

        const address = await Address.findOneAndUpdate(
            {
                userId,
                deletedAt: null
            },
            {
                userId,
                receiverName,
                receiverPhone,
                provinceCity,
                ward,
                specificAddress
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return address;
    }
}

module.exports = new AddressService();
