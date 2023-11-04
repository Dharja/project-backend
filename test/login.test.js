const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const login = (user, password, log) => {
  if (!password) {
    log('no password');
  }
}

module.exports = login;