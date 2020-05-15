const TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function validateToken( req, res, next ){
    let token = null;
    if (req.headers.authorization) {
        token = req.headers.authorization;
    } else if (req.headers['book-api-key']) {
        token = req.headers['book-api-key'];
    } else if (req.query.apiKey) {
        token = req.query.apiKey;
    }

    if( !token ){
        res.statusMessage = "You need to send the 'authorization' token.";
        return res.status( 401 ).end();
    }

    if (token.includes('Bearer')) {
        token = token.substring(7);
    }

    if( token !== TOKEN ){
        res.statusMessage = "The 'authorization' TOKEN is invalid.";
        return res.status( 401 ).end();
    }

    console.log('valid token...');

    next();

}

module.exports = validateToken;