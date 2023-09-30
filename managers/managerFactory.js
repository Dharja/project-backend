const productManager = require('./productManager');
const cartManager = require('./cartManager');
const chatMessageManager = require('./chatManager');
const userManager = require('./userManager');

const productManagerFile = require('./productManager.file');

const { PERSISTANCE } = require('../config/config');

class ManagerFactory {
    static getManagerInstance(name) {
        console.log(PERSISTANCE, name);
        if (PERSISTANCE == "mongo") {
            // regresar alguno de los managers de mongo
            switch(name) {
            case "products":
                return productManager;
            };
        } else {
        // regresar alguno de los managers de json
        switch(name) {
            case "products":
            return productManagerFile;
        };
        };
    };
};

module.exports = ManagerFactory;