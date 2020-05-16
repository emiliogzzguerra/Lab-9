const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const uuid = require('uuid');
const mongoose = require( 'mongoose' );
const validateToken = require('./middleware/validateToken');
const { Bookmarks } = require('./models/bookmarkModel')
const { check, validationResult } = require('express-validator');
const { DATABASE_URL, PORT } = require('./config');

const app = express();
const jsonParser = bodyParser.json();

app.use( express.static( 'public' ));
app.use(morgan('dev'));
app.use(validateToken)

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    console.log(process.env)
}

app.get( '/bookmarks', ( req, res ) => {
    console.log("Entered the route...")
    Bookmarks
        .getAllBookmarks()
        .then( result => {
            return res.status( 200 ).json( result );
        })
        .catch( err => {
            console.log(err);
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        })
});

app.post( '/bookmarks', jsonParser, [
    check('title').isString().not().isEmpty(),
    check('description').isString().not().isEmpty(),
    check('url').isString().not().isEmpty(),
    check('rating').isNumeric().not().isEmpty(),
], ( req, res ) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array({ onlyFirstError: true }) })
    }

    let newBookmark = {
        id : uuid.v4(),
        title : req.body.title,
        description: req.body.description,
        url: req.body.url,
        rating: req.body.rating
    }


    Bookmarks
        .createBookmark(newBookmark)
        .then(createdBookmark=> {
            return res.status( 201 ).json(createdBookmark) 
        })
        .catch( err => {
            console.log(err);
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status( 500 ).end();
        })
});

app.patch( '/bookmark/:id', jsonParser, [
    check('id').isString().not().isEmpty(),
], ( req, res ) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(406).json({ errors: errors.array({ onlyFirstError: true }) })
    }

    if (req.params.id != req.body.id) {
        res.statusMessage = `The id in the body doesn't match the one on the params`;
        return res.status(409).end();
    }
    return Bookmarks
        .updateBookmark(req.params.id, req.body.object)
        .then((bookmark) => {
            if (!bookmark) {
                return res.status( 404 ).end();
            }
            return res.status(202).json(bookmark);
        }).catch(err => {
            console.log(err);
            res.statusMessage = "Something is wrong with the Database. Try again later.";
            return res.status(500).end();
        })
});

app.delete( '/bookmark/:id', ( req, res ) => {
    let bookmarkId = req.params.id;
    Bookmarks
        .deleteBookmark(bookmarkId)
        .then(response => {
            console.log(response);
            console.log("inside app.delete");
            return res.status( 200 ).end();
        }).catch(err => {
            console.log("inside app.delete - error");
            res.statusMessage = "Something wrong happened with the DB";
            return res.status( 500 ).end();
        })
});

app.get( '/bookmark', ( req, res ) => {
    var title = req.query.title;

    if (!title) {
        res.statusMessage = 'A title is required in this endpoint.';
        return res.status(406).end();
    }

    Bookmarks.getBookmark(title)
    .then(bookmark => {
        return res.status(200).json(bookmark);
    }).catch((err) => {
        res.statusMessage = `The title ${title} wasn't found on any of our titles.`;
        return res.status(404).end();        
    })
});

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );
    console.log("DATABASE_URL:", DATABASE_URL)
    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});