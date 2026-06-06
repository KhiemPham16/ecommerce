const prisma = require('~/libs/prisma');

const { AppError } = require('~/errors/AppError');
const { generateSlug } = require('~/utils/slugify');

class PostService {
    async getPosts() {
        return prisma.post.findMany({
            where: {
                status: 'PUBLISHED'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                categories: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                publishedAt: 'desc'
            }
        });
    }

    async getAdminPosts() {
        return prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                categories: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getPostBySlug(slug) {
        const post = await prisma.post.findUnique({
            where: {
                slug
            },
            include: {
                author: true,
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        if (!post) {
            throw new AppError(404, 'Bài viết không tồn tại');
        }

        return post;
    }

    async createPost(authorId, data) {
        const { title, dek, excerpt, bodyHtml, coverImageUrl, readMinutes, featured, status, categoryIds = [] } = data;

        const slug = generateSlug(title);

        return prisma.post.create({
            data: {
                slug,
                title,
                dek,
                excerpt,
                bodyHtml,
                coverImageUrl,
                readMinutes,
                featured,
                status,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                authorId,

                categories: {
                    create: categoryIds.map((categoryId) => ({
                        categoryId
                    }))
                }
            }
        });
    }

    async updatePost(postId, data) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new AppError(404, 'Bài viết không tồn tại');
        }

        return prisma.post.update({
            where: {
                id: postId
            },
            data: {
                ...data
            }
        });
    }

    async deletePost(postId) {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if (!post) {
            throw new AppError(404, 'Bài viết không tồn tại');
        }

        await prisma.post.delete({
            where: {
                id: postId
            }
        });

        return true;
    }
}

module.exports = new PostService();
