const localNumbers = (index) => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : '';
};

const Link = (doc) => {
    if (doc.type === 'product') {
        return `/detail/${doc.slug}`;
    }

    if (doc.type === 'about') {
        return '/about';
    }

    if (doc.type === 'collections') {
        console.log(doc);
        return '/collections';
    }

    return '/';
};

module.exports = {
    localNumbers,
    Link,
};
