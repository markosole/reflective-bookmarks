require('dotenv').config()
var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { Double } = require('mongodb');
const { json } = require('body-parser');
const res = require('express/lib/response');

// Version: v1.0.0


//  /$$$$$$$              /$$               /$$
// | $$__  $$            | $$              | $$
// | $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ | $$$$$$$   /$$$$$$   /$$$$$$$  /$$$$$$
// | $$  | $$ |____  $$|_  $$_/   |____  $$| $$__  $$ |____  $$ /$$_____/ /$$__  $$
// | $$  | $$  /$$$$$$$  | $$      /$$$$$$$| $$  \ $$  /$$$$$$$|  $$$$$$ | $$$$$$$$
// | $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$| $$  | $$ /$$__  $$ \____  $$| $$_____/
// | $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$| $$$$$$$/|  $$$$$$$ /$$$$$$$/|  $$$$$$$
// |_______/  \_______/   \___/   \_______/|_______/  \_______/|_______/  \_______/

// MongoDB database connection
const mongocomms = process.env.MONGO_HOST + ":" + process.env.MONGO_PORT + "/" + process.env.MONGO_COLLECTION;

mongoose.connect('mongodb://'+mongocomms,{useNewUrlParser:true}, function(err){
        if(err){console.log(err)} else {console.log('Mongo Database connected to host: ' + process.env.MONGO_HOST + ":" + process.env.MONGO_PORT)}
})

// Categories Schema
const Categories = mongoose.Schema({
    _id: Number,
    category_name: String,
    category_order: Number,
    category_owner: Number,
});

const Category = mongoose.model('Category',Categories);

// Bookmarks Schema
const Bookmarks = mongoose.Schema({
    _id: String,
    bookmark_name: String,
    bookmark_alias: String,
    bookmark_image: String,
    bookmark_url: String,
    bookmark_order: Number,
    bookmark_category: Number,
    bookmark_owner: Number,
}, {timestamps: false});

const Bookmark = mongoose.model('Bookmarks', Bookmarks);

// User Profiles Schema
const UserProfiles = mongoose.Schema({
    _id: Number,
    profile_name: String,
    profile_avatar: String,
    profile_enabled: Boolean
});

const UserProfile = mongoose.model('UserProfiles', UserProfiles);


// @ Add new user profile to Database
async function mongoSaveUserProfile(data){
    var resp = '{"status": "error"}'; // Default
    if(data){
      const profile = new UserProfile(data);
      resp = await profile.save().then(function(){
          console.log("database.mongoSaveUserProfile -> Data saved to database!");
          return '{"status":"success", "message": "User profile added successfully!"}';
        })
        .catch((error) => {
            //When there are errors We handle them...
            console.log("database.mongoSaveUserProfile -> Error, data not saved!");
            var err = JSON.parse(JSON.stringify(error));
            var status_message = "";
            if(err.code == 11000){
                status_message = "Profile already exists!";
            }
            return '{"status": "error", "code": "' + err.code + '", "message": "' + status_message + '"}';
        });
    }
    return resp;
}

// @ Get user profile from Database
async function mongoGetUserProfiles(){
    const profiles = mongoose.model('UserProfile',UserProfiles);
    var query = await UserProfile.find({});
    var userProfiles = [];
    if (query) {
        query.forEach(function (profile) {
            userProfiles.push({
                id: profile._id, 
                profile_name: profile.profile_name, 
                profile_avatar: profile.profile_avatar,
                profile_enabled: profile.profile_enabled
            })
      });
    }
    return userProfiles;
}

// Delete user profile & data from Database
async function mongoDeleteBookmarksByProfile(profile_id){
    var resp = '{"status": "error"}';
    if(profile_id){
        var resp = await Bookmark.deleteMany({ category_owner: profile_id }).then(function(err, res){
            console.log("database.mongoDeleteBookmarksByProfile -> Delete bookmarks for user from database!");
            console.log(err);
            if(err.deletedCount > 0){
                return '{"status":"success", "message": "Users bookmarks deleted successfully!"}';
            } else {
                return '{"status": "error", "code": "' + err.code + '", "message": "Bookmark Record not deleted"}';
            }
            // ToDo:  Check response for errors
            // if(err){
            //     var errMessage = err.matchedCount == 0 ? "Record does not exist" : "Bookmark Record not deleted";
            //     if(err.matchedCount == 1){

            //     }
            //     return '{"status": "error", "code": "' + err.code + '", "message": "' + errMessage + '"}';
            // } else {
            //     return '{"status":"success", "message": "Users bookmarks deleted successfully!"}';
            // }
        });
    }
    return resp;
}
// Delete categories by profile
async function mongoDeleteCategoriesByProfile(profile_id){
    var resp = '{"status": "error"}';
    if(profile_id){
        var resp = await Category.deleteMany({ category_owner: profile_id }).then(function(err, res){
            console.log("database.mongoDeleteCategoriesByProfile -> Delete categories for user from database!");
            console.log(err);
            // ToDo:  Check response for errors
            if(err.deletedCount > 0){
                return '{"status":"success", "message": "Users categories deleted successfully!"}';
            } else {
                return '{"status": "error", "code": "' + err.code + '", "message": "Category Record not deleted"}';
            }
            // if(err){
            //     var errMessage = err.matchedCount == 0 ? "Record does not exist" : "Category Record not deleted";
            //     if(err.matchedCount == 1){

            //     }
            //     return '{"status": "error", "code": "' + err.code + '", "message": "' + errMessage + '"}';
            // } else {
            //     return '{"status":"success", "message": "Users bookmarks deleted successfully!"}';
            // }
        });
    }
    return resp;
}
// Delete user profile from Database
async function mongoDeleteUserProfile(profile_id){
    var resp = '{"status": "error"}';
    if(profile_id){
        var resp = await UserProfile.deleteOne({ _id: profile_id }).then(function(err, res){
            console.log("database.mongoDeleteUserProfile -> User profile deleted from database!");
            if(err.deletedCount == 1){
                return '{"status":"success", "message": "User profile deleted successfully!"}';
            } else {
                return '{"status": "error", "code": "' + err.code + '", "message": "' + errMessage + '"}';
            }
        });
    }
    return resp;
}



// @ Add new bookmark to Database
async function mongoSaveBookmark(data){
    var resp = '{"status": "error"}'; // Default
    console.log(" > Endpoint > MongoDB > Adding new bookmark: ", data)

    if(data){
      const bookmark = new Bookmark(data);
      resp = await bookmark.save().then(function(){
          console.log("database.mongoSaveBookmark -> Data saved to database!");
          return '{"status":"success", "message": "Category added successfully!"}';
        })
        .catch((error) => {
            //When there are errors We handle them...
            console.log("database.mongoSaveBookmark -> Error, data not saved!");
            var err = JSON.parse(JSON.stringify(error));
            var status_message = "";
            if(err.code == 11000){
                status_message = "Bookmark already exists!";
            }
            return '{"status": "error", "code": "' + err.code + '", "message": "' + status_message + '"}';
        });
    }
    return resp;
}

// @ Update one Bookmark item data by ID
async function mongoUpdateBookmark(data){
    var resp = '{"status": "error"}';
    if(data){
      var resp = await Bookmark.updateOne({ _id: data._id }, data).then(function(err, res){
          console.log("database.mongoUpdateBookmark -> Update bookmark data saved in database!");
          if(err){
            var errMessage = err.matchedCount == 0 ? "Record does not exist" : "Record not updated";
            if(err.matchedCount == 1){
                return '{"status": "success", "message" : "Changes saved successfully"}';
            } else {
                return '{"status": "error", "code": "' + err.modifiedCount + '", "message": "' + errMessage + '"}';
            }
          }
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log("database.mongoUpdateBookmark -> Error, data not saved! Server error");
            return '{"status": "error", "code": "400", "message": "Server error!"}';
        });
    }
    return resp;
}

// @ Detele one Bookmark item by ID
async function mongoDeleteBookmark(data){
    var resp = '{"status": "error"}';
    if(data){
      var resp = await Bookmark.deleteOne({ _id: data._id }).then(function(status, res){
          console.log("database.deleteItem -> Delete item from database!");
          if(status){
            if(status.deletedCount == 1){
                return '{"status": "success"}';
            } else {
                var errMessage = status.deletedCount == 0 ? "Record does not exist" : "Record not deleted";
                return '{"status": "error", "code": "' + status.deletedCount + '", "message": "' + errMessage + '"}';
            }
          }else {
            return '{"status": "error"}';
          }
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log("database.deleteItem -> Error, data not deleted! Server error");
            console.log(error);
            return '{"status": "error", "code": "400", "message": "Server error!"}';
        });
    }
    return resp;
}


// @ Add new category to Database
async function mongoSaveCategory(data){
    var resp = '{"status": "error"}'; // Default

    console.log(" > Endpoint > MongoDB > Adding new category: ", data)

    if(data){
      const category = new Category(data);
      resp = await category.save().then(function(){
          console.log("database.mongoSaveCategory -> Data saved to database!");
          return '{"status":"success", "message": "Category added successfully!"}';
        })
        .catch((error) => {
            //When there are errors We handle them...
            console.log("database.mongoSaveCategory -> Error, data not saved!");
            var err = JSON.parse(JSON.stringify(error));
            var status_message = "";
            if(err.code == 11000){
                status_message = "Category already exists!";
            }
            return '{"status": "error", "code": "' + err.code + '", "message": "' + status_message + '"}';
        });
    }
    return resp;
}

// @ Get List of all Categories
async function mongoGetCategories(owner){
    const categories = mongoose.model('Category',Categories);
    var query = await Category.find({ category_owner: owner });

    var listCategories = [];
    if (query) {
        query.forEach(function (cat) {
        listCategories.push({id: cat._id, category_name: cat.category_name, category_order: cat.category_order, category_owner: cat.category_owner})
      });
    }

    //  Todo: Sort by category_order
    listCategories.sort(function(a, b) {
        return a.category_order - b.category_order;
    });

    return listCategories;
}

// @ Update one Category by ID
async function mongoUpdateCategory(data){
    var resp = '{"status": "error"}';
    if(data){
      var resp = await Category.updateOne({ _id: data._id }, data).then(function(err, res){
          console.log("database.mongoUpdateCategory -> Update Category data saved in database!");
          if(err){
            var errMessage = err.matchedCount == 0 ? "Category Record does not exist" : "Record not updated";
            if(err.matchedCount == 1){
                return '{"status": "success", "message" : "Changes saved successfully"}';
            } else {
                return '{"status": "error", "code": "' + err.modifiedCount + '", "message": "' + errMessage + '"}';
            }
          }
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log("database.mongoUpdateBookmark -> Error, data not saved! Server error");
            return '{"status": "error", "code": "400", "message": "Server error!"}';
        });
    }
    return resp;
}

// @ Delete one Category by ID
async function mongoDeleteCategory(data){
    var resp = '{"status": "error"}';
    var isEmpty = false;
    // Check if category has any associated bookmarks
    var resp = await Bookmark.find({ bookmark_category: data._id }).then(function(status, res){
        console.log("database.mongoDeleteCategory -> Check if category has any associated bookmarks");
        if(status){
            if(status.length > 0){
                return '{"status": "error", "code": "400", "message": "Category has associated bookmarks!"}';
            } else {
                isEmpty = true;
                return '{"status": "success", "message": "Category does not match any bookmarks!"}';
            }
        }else {
            return '{"status": "error"}';
        }
    })
    .catch((error) => {
        //When there are errors We handle them here
        console.log("database.mongoDeleteCategory -> Error, data not deleted! Server error");
        console.log(error);
        return '{"status": "error", "code": "400", "message": "Server error!"}';
    });

    // Delete category
    if(isEmpty){
        var resp = await Category.deleteOne({ _id: data._id }).then(function(status, res){
            console.log("database.deleteItem -> Delete item from database!");
            if(status){
                if(status.deletedCount == 1){
                    return '{"status": "success", "message": "Category deleted successfully!"}';
                } else {
                    var errMessage = status.deletedCount == 0 ? "Record does not exist" : "Record not deleted";

                    return '{"status": "error", "code": "' + status.deletedCount + '", "message": "' + errMessage + '"}';
                }
            }else {
                return '{"status": "error"}';
            }
        })
        .catch((error) => {
            //When there are errors We handle them here
            console.log("database.deleteItem -> Error, data not deleted! Server error");
            console.log(error);
            return '{"status": "error", "code": "400", "message": "Server error!"}';
        });
    }
    return resp;
}


// @ Get List of all Bookmarks
async function mongoGetBookmarks(owner){
    const bookmarks = mongoose.model('Bookmarks',Bookmarks);
    var query = await Bookmark.find({ bookmark_owner: owner });

    var listBookmarks = [];
    if (query) {
        query.forEach(function (bookmark) {
            listBookmarks.push({
            id: bookmark._id, 
            bookmark_name: bookmark.bookmark_name, 
            bookmark_alias: bookmark.bookmark_alias,
            bookmark_image: bookmark.bookmark_image,
            bookmark_url: bookmark.bookmark_url,
            bookmark_order: bookmark.bookmark_order,
            bookmark_category: bookmark.bookmark_category,
            bookmark_owner: bookmark.bookmark_owner
        })
      });
    }

    // Sort by category_order
    listBookmarks.sort(function(a, b) {
        return a.bookmark_order - b.bookmark_order;
    });

    return listBookmarks;
}


module.exports = { mongoSaveUserProfile, mongoGetUserProfiles, mongoSaveCategory, mongoGetCategories, mongoSaveBookmark, mongoDeleteBookmark, mongoDeleteCategory, mongoUpdateBookmark, mongoUpdateCategory, mongoGetBookmarks, mongoDeleteBookmarksByProfile, mongoDeleteCategoriesByProfile, mongoDeleteUserProfile };



 


