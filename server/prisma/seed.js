const bcrypt = require('bcrypt');

require('dotenv').config();
require('module-alias/register');

const prisma = require('~/libs/prisma');

async function main() {
    prisma.initPrisma();

    const password = await bcrypt.hash('123456', 10);

    const users = [
        {
            username: 'admin',
            fullName: 'System Administrator',
            email: 'admin@bookstore.com',
            phone: '0900000001',
            role: 'ADMIN'
        },
        {
            username: 'manager',
            fullName: 'Store Manager',
            email: 'manager@bookstore.com',
            phone: '0900000002',
            role: 'MANAGER'
        },
        {
            username: 'employee1',
            fullName: 'Nguyễn Văn Nhân Viên',
            email: 'employee1@bookstore.com',
            phone: '0900000003',
            role: 'EMPLOYEE'
        },
        {
            username: 'employee2',
            fullName: 'Trần Thị Bán Hàng',
            email: 'employee2@bookstore.com',
            phone: '0900000004',
            role: 'EMPLOYEE'
        },
        {
            username: 'customer1',
            fullName: 'Lê Minh Khách',
            email: 'customer1@gmail.com',
            phone: '0900000005',
            role: 'CUSTOMER'
        },
        {
            username: 'customer2',
            fullName: 'Phạm Quốc Mua Sách',
            email: 'customer2@gmail.com',
            phone: '0900000006',
            role: 'CUSTOMER'
        }
    ];

    for (const userData of users) {
        const user = await prisma.user.upsert({
            where: {
                email: userData.email
            },
            update: {},
            create: {
                ...userData,
                password,
                emailVerifiedAt: new Date()
            }
        });

        if (user.role === 'CUSTOMER') {
            await prisma.address.upsert({
                where: {
                    userId: user.id
                },
                update: {},
                create: {
                    userId: user.id,
                    receiverName: user.fullName,
                    receiverPhone: user.phone,
                    provinceCity: 'TP Hồ Chí Minh',
                    ward: 'Phường Bến Nghé',
                    specificAddress: '123 Nguyễn Huệ',
                    isDefault: true
                }
            });
        }
    }

    console.log('Seed users completed');

    const categories = [];

    const categorySeeds = [
        {
            name: 'Tiểu thuyết',
            slug: 'tieu-thuyet'
        },
        {
            name: 'Kinh doanh',
            slug: 'kinh-doanh'
        },
        {
            name: 'Công nghệ',
            slug: 'cong-nghe'
        },
        {
            name: 'Thiếu nhi',
            slug: 'thieu-nhi'
        }
    ];

    for (const categoryData of categorySeeds) {
        const category = await prisma.category.upsert({
            where: {
                slug: categoryData.slug
            },
            update: {},
            create: categoryData
        });

        categories.push(category);
    }

    console.log('Seed categories completed');

    const cod = await prisma.paymentMethod.upsert({
        where: {
            code: 'COD'
        },
        update: {},
        create: {
            name: 'Thanh toán khi nhận hàng',
            code: 'COD',
            description: 'Khách hàng thanh toán khi nhận hàng'
        }
    });

    await prisma.paymentMethod.upsert({
        where: {
            code: 'BANK_TRANSFER'
        },
        update: {},
        create: {
            name: 'Chuyển khoản ngân hàng',
            code: 'BANK_TRANSFER',
            description: 'Thanh toán qua ngân hàng'
        }
    });

    await prisma.paymentMethod.upsert({
        where: {
            code: 'MOMO'
        },
        update: {},
        create: {
            name: 'Ví MoMo',
            code: 'MOMO',
            description: 'Thanh toán qua ví MoMo'
        }
    });

    await prisma.paymentMethod.upsert({
        where: {
            code: 'VNPAY'
        },
        update: {},
        create: {
            name: 'VNPay',
            code: 'VNPAY',
            description: 'Thanh toán qua VNPay'
        }
    });

    console.log('Seed payment methods completed');

    const products = [];

    const productSeeds = [
        {
            title: 'Đắc Nhân Tâm',
            slug: 'dac-nhan-tam',
            author: 'Dale Carnegie',
            price: 120000,
            stock: 100,
            categoryId: categories[1].id
        },
        {
            title: 'Clean Code',
            slug: 'clean-code',
            author: 'Robert C. Martin',
            price: 250000,
            stock: 50,
            categoryId: categories[2].id
        },
        {
            title: 'Lập Trình JavaScript',
            slug: 'lap-trinh-javascript',
            author: 'F8 Team',
            price: 180000,
            stock: 80,
            categoryId: categories[2].id
        },
        {
            title: 'Harry Potter',
            slug: 'harry-potter',
            author: 'J.K. Rowling',
            price: 200000,
            stock: 60,
            categoryId: categories[0].id
        }
    ];

    for (const productData of productSeeds) {
        const product = await prisma.product.upsert({
            where: {
                slug: productData.slug
            },
            update: {},
            create: {
                ...productData,
                description: `${productData.title} description`,
                thumbnail: '/uploads/products/default.jpg'
            }
        });

        products.push(product);
    }

    console.log('Seed products completed');

    const coupon50k = await prisma.coupon.upsert({
        where: {
            code: 'KHIEM50K'
        },
        update: {},
        create: {
            couponType: 'CUSTOM',
            code: 'KHIEM50K',
            type: 'FIXED',
            value: 50000,
            minOrderAmount: 300000,
            usageLimit: 100,
            expiresAt: new Date('2027-12-31T23:59:59.000Z')
        }
    });

    await prisma.coupon.upsert({
        where: {
            code: 'SALE10'
        },
        update: {},
        create: {
            couponType: 'CUSTOM',
            code: 'SALE10',
            type: 'PERCENT',
            value: 10,
            minOrderAmount: 200000,
            maxDiscountAmount: 100000,
            usageLimit: 100,
            expiresAt: new Date('2027-12-31T23:59:59.000Z')
        }
    });

    console.log('Seed coupons completed');

    const customer = await prisma.user.findUnique({
        where: {
            email: 'customer1@gmail.com'
        }
    });

    const address = await prisma.address.findUnique({
        where: {
            userId: customer.id
        }
    });

    const existedOrder = await prisma.order.findFirst({
        where: {
            userId: customer.id
        }
    });

    if (!existedOrder) {
        await prisma.order.create({
            data: {
                userId: customer.id,
                addressId: address.id,
                paymentMethodId: cod.id,
                couponId: coupon50k.id,

                status: 'PENDING',
                paymentStatus: 'UNPAID',

                totalAmount: 490000,
                discountAmount: 50000,
                finalAmount: 440000,

                note: 'Đơn hàng test',

                items: {
                    create: [
                        {
                            productId: products[0].id,
                            title: products[0].title,
                            price: products[0].price,
                            quantity: 2,
                            subtotal: 240000
                        },
                        {
                            productId: products[1].id,
                            title: products[1].title,
                            price: products[1].price,
                            quantity: 1,
                            subtotal: 250000
                        }
                    ]
                }
            }
        });
    }

    console.log('Seed orders completed');
    console.log('Seed completed');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        if (prisma.$disconnect) {
            await prisma.$disconnect();
        }
    });
