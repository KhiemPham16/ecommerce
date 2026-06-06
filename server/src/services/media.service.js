const fs = require('fs');
const path = require('path');

const prisma = require('~/libs/prisma');
const { AppError } = require('~/errors/AppError');

class MediaService {
    async uploadMedia(userId, file, data) {
        if (!file) {
            throw new AppError(400, 'File là bắt buộc');
        }

        const { alt, folder } = data;

        let type = 'DOCUMENT';

        if (file.mimetype.startsWith('image/')) {
            type = 'IMAGE';
        }

        if (file.mimetype.startsWith('video/')) {
            type = 'VIDEO';
        }

        return prisma.media.create({
            data: {
                fileName: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                url: `/uploads/${folder || 'media'}/${file.filename}`,
                type,
                alt,
                folder: folder || 'media',
                uploadedById: userId
            }
        });
    }

    async getMedia() {
        return prisma.media.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });
    }

    async getMediaById(mediaId) {
        const media = await prisma.media.findUnique({
            where: {
                id: mediaId
            },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        if (!media) {
            throw new AppError(404, 'Media không tồn tại');
        }

        return media;
    }

    async updateMedia(mediaId, data) {
        const media = await prisma.media.findUnique({
            where: {
                id: mediaId
            }
        });

        if (!media) {
            throw new AppError(404, 'Media không tồn tại');
        }

        return prisma.media.update({
            where: {
                id: mediaId
            },
            data: {
                alt: data.alt,
                folder: data.folder
            }
        });
    }

    async deleteMedia(mediaId) {
        const media = await prisma.media.findUnique({
            where: {
                id: mediaId
            }
        });

        if (!media) {
            throw new AppError(404, 'Media không tồn tại');
        }

        const filePath = path.join(process.cwd(), 'src', 'public', media.url);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await prisma.media.delete({
            where: {
                id: mediaId
            }
        });

        return true;
    }
}

module.exports = new MediaService();
