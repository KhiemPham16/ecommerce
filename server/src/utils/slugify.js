const slugify = require('slugify');

function generateSlug(text) {
    return slugify(text, {
        lower: true,
        strict: true,
        locale: 'vi',
        trim: true
    });
}

async function generateUniqueSlug(name, model) {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let count = 1;

    while (
        await model.exists({
            slug
        })
    ) {
        slug = `${baseSlug}-${count}`;
        count++;
    }

    return slug;
}

module.exports = {
    generateSlug,
    generateUniqueSlug
};
