const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app.js');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Rutas de sesiones', () => {
    it('Debería autenticar un usuario con credenciales válidas', (done) => {
        const userCredentials = {
            email: 'correo@example.com',
            password: 'contraseña_segura',
        };

        chai.request(app)
            .post('/api/sessions/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
        });

    it('Debería cerrar la sesión de un usuario', (done) => {
        chai.request(app)
            .get('/api/sessions/logout')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                done();
            });
        });

    it('Debería proteger una ruta para usuarios autenticados', (done) => {
        chai.request(app)
            .get('/api/ruta/protegida')
            .end((err, res) => {
            expect(res).to.have.status(403); // Debería devolver un código 403 si no estás autenticado
            done();
            });
        });
    });  