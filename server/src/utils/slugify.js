const prisma = require('~/libs/prisma');
const slugify = require('slugify');

function generateSlug(text) {
    return slugify(text, {
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true
    });
}

async function generateUniqueCategorySlug(name) {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let count = 1;

    while (
        await prisma.category.findUnique({
            where: {
                slug
            }
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
}

module.exports = {
    generateSlug,
    generateUniqueCategorySlug
};
