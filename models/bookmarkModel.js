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
        .findOneAndUpdate({ "id": id }, { "$set": newBookmark}, { useFindAndModify: false, new: true })
        .then(result => {
            return result;
        }).catch(err => {
            return err;
        });
    },
    deleteBookmark : function(id) {
        console.log("here brotherr");
        return bookmarksCollection
                .deleteOne({id: id})
                .then(result => {
                    console.log(result);
                    if (result.deletedCount > 0) {
                        console.log("success!!!");
                        return result;
                    } else {
                        throw new Error("Didn't find this id")
                    }
                })
                .catch(err => {
                    console.log("found an error");
                    return err;
                })
    },
    getBookmark : function(title) {
        console.log("heree", title)
        return bookmarksCollection
                .find({title: {$regex : `.*${title}.*`}})
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