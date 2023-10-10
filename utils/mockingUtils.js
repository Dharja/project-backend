const faker = require('@faker-js/faker');

const generateUser = () => {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: faker.helpers.arrayElement(['Usuario', 'Admin']),
        age: faker.number.int({ min: 17, max: 70 }),
        gender: faker.person.gender(),
    };
};

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.isbn(),
        price: faker.commerce.price(),
        stock: faker.number.int(5),
        category: faker.commerce.productMaterial(),
    };
};

const generateUsers = (count = 5) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push(generateUser());
    }
    return users;
};

const generateProducts = (count = 5) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push(generateProduct());
    }
    return products;
};

module.exports = {
    generateUsers,
    generateProducts,
};

