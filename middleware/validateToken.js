function validateToken( req, res, next ){
    console.log("here");
    console.log(req.headers);
    let token = null;
    if (req.headers.authorization) {
        token = req.headers.authorization;
    } else if (req.headers['book-api-key']) {
        token = req.headers['book-api-key'];
    } else if (req.query.apiKey) {
        token = req.query.apiKey;
    }
    console.log("here");

    if( !token ){
        res.statusMessage = "You need to send the 'authorization' token.";
        return res.status( 401 ).end();
    }

    console.log("here");
    if (token.includes('Bearer')) {
        token = token.substring(7);
    }

    console.log("here");
    if( token !== process.env.TOKEN ){
        res.statusMessage = "The 'authorization' TOKEN is invalid.";
        return res.status( 401 ).end();
    }

    console.log("here");
    console.log('valid token...');

    next();

}

module.exports = validateToken;