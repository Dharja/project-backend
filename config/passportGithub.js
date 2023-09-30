const GitHubStrategy = require('passport-github2')
const userManager = require('../managers/userManager')

const CLIENT_ID = "AQUI VA EL CLIENTID"
const CLIENT_SECRET = "AQUI VA EL CLIENT SECRET"
const CALLBACK_URL = 'http://localhost:3000/api/auth/github/callback'


const auth = async (accessToken, refreshToken, profile, done) => {

    try {
        console.log(profile);

        const { _json: { name, email } } = profile

        console.log(name, email);

        if (!email) {
            console.log('el usuario no tiene su email publico');
            return done(null, false);
        };

        let user = await userManager.getByEmail(email)

        if (!user) {
            const [ firstname, lastname] = name.split(' ')
            const _user = await userManager.create({
                firstname,
                lastname,
                email,
                age: 18,
                gender: 'Male'
            });
            user = _user._doc
        };
        
        done(null, user);
    } catch (e) {
        console.log(e);
        done(e, false);
    };
};

// instanciamos el handler para el login con github
const gitHubHandler = new GitHubStrategy(
    // primer parametro es un objeto options
    // con los datos de la pp de github que creamos
    {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    },
    auth,
);

module.exports = gitHubHandler;