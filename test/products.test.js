const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Rutas de productos', () => {
    it('Debería obtener una lista de productos', (done) => {
        chai.request(app)
        .get('/api/products')
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
        });
    });

    it('Debería obtener un producto por ID', (done) => {
        
        const productId = 'id';
        chai.request(app)
        .get(`/api/products/${productId}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
        });
    });

    it('Debería crear un nuevo producto', (done) => {
        const newProduct = {
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto',
        price: 99.99,
        };

    chai.request(app)
        .post('/api/products')
        .send(newProduct)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', newProduct.name);
            done();
        });
    });

    it('Debería actualizar un producto existente', (done) => {
        const productId = 'ID_producto';
        const updatedProduct = {
        name: 'Producto Actualizado',
        };

    chai.request(app)
        .put(`/api/products/${productId}`)
        .send(updatedProduct)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', updatedProduct.name);
            done();
        });
    });

    it('Debería eliminar un producto existente', (done) => {
        const productId = 'ID'; 
        chai.request(app)
        .delete(`/api/products/${productId}`)
        .end((err, res) => {
            expect(res).to.have.status(204);
            done();
        });
    });
});