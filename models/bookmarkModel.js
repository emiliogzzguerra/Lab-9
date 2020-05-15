const mongoose = require( 'mongoose' );

const bookmarksSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
});

const bookmarksCollection = mongoose.model( 'bookmarks', bookmarksSchema );

const Bookmarks = {
    updateBookmark: function(id, newBookmark) {
        return bookmarksCollection
        .findOneAndUpdate({ "id": id }, { "$set": newBookmark}, { useFindAndModify: false, new: true }, (err, found) => {
            if (!found) {
                return null;
            }
            return found;
        });
    },
    deleteBookmark : function(id) {
        return bookmarksCollection
                .deleteOne({id: id}, (err, res) => {
                    if (err) {
                        return res.status( 404 ).end();
                    }
                    return res;
                })
    },
    getBookmark : function(title) {
        return bookmarksCollection
                .find({title: title})
                .then( bookmark => {
                    return bookmark;
                })
                .catch( err => {
                    return err;
                });
    },
    createBookmark : function( newBookmark ){
        return bookmarksCollection
                .create( newBookmark )
                .then( createdBookmark => {
                    return createdBookmark;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAllBookmarks : function(){
        return bookmarksCollection
                .find()
                .then( allBookmarks => {
                    console.log("allbookmarks success")
                    return allBookmarks;
                })
                .catch( err => {
                    console.log("allbookmarks error")
                    return err;
                });
    }
}

module.exports = { Bookmarks };