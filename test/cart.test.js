const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Rutas de carritos', () => {
    it('Debería obtener una lista de carritos', (done) => {
        chai.request(app)
            .get('/api/carts')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('Debería obtener un carrito por ID', (done) => {
        const cartId = 'ID_carrito'; 
        chai.request(app)
            .get(`/api/carts/${cartId}`)
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
        });
    });

    it('Debería crear un nuevo carrito', (done) => {
        chai.request(app)
            .post('/api/carts')
            .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            done();
        });
    });
});
