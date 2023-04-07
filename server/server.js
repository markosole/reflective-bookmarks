// Bookmark Manager
// Simple Bookmark application for custom Homepage
// Version: 1.0.1
// 01.04.2023
// Author: Marko Solomun - Reflect Dev

console.log('Server-side code running');

require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
const database = require("./helpers/database");

const serverport    = process.env.SERVER_PORT || 5001;
const server_host   = process.env.SERVER_HOST || 'http://localhost';

app.use(express.static('public'));
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.use(express.json({extended: true, limit: '1mb'}));
// app.use(express.static(__dirname + '/public'));
app.listen(serverport, () => {
  console.log(`listening on ${serverport}`);
});

// @ ROUTE Status
app.get('/status', (req, res) => {
  // ToDo:  Use res.sendFile() to send an HTML file back to the client
  // res.sendFile(__dirname + '/index.html');
  res.status(200).json({status: 200, service_status: "Operational"});
});





// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// @ ROUTE  Get Suser Profiles
app.get('/user-profiles', async (req, res) => {
    res.status(200);
    var retData = await database.mongoGetUserProfiles();
    if(retData){
      res.json(retData);
    } else {
        res.status(500);
        res.json(retData);
    }
	res.end();
});

// @ ROUTE Create User Profile
app.post('/user-profiles/add', async (req, res) => {
    const reqData = req.body;
    var timestamp = new Date().valueOf();
    var category = {
        "_id": timestamp,
        "profile_name": reqData.profile_name,
        "profile_avatar": reqData.profile_avatar
    }
    var returnedStatus = await database.mongoSaveUserProfile(category);
    var ret = JSON.parse(returnedStatus);
    if(ret.status == "success"){
        res.send(returnedStatus);
    } else {
        res.send(ret);
    }
});


// @ ROUTE Delete User Profile
app.post('/user-profiles/delete', async (req, res) => {
    const reqData = req.body;
    var user = reqData.profile_id;
    console.log(" > Endpoint > Deleting user profile: ", user)

    var deletebookmarks = await database.mongoDeleteBookmarksByProfile(user);
    var deletecategories = await database.mongoDeleteCategoriesByProfile(user);
    var deleteprofile = await database.mongoDeleteUserProfile(user);

    var ret = JSON.parse(deleteprofile);
    if(ret.status == "success"){
        res.send(deleteprofile);
    } else {
        res.send(ret);
    }

});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>





// @ ROUTE  Get Categories
app.post('/categories', async (req, res) => {
    const owner = req.body;
    res.status(200);
    var retData = await database.mongoGetCategories(owner.category_owner);
    if(retData){
      res.json(retData);
    } else {
        res.status(500);
        res.json(retData);
    }
	res.end();
});

// @ ROUTE  Get Bookmarks
app.get('/bookmarks', async (req, res) => {
    res.status(200);
    var retData = await database.mongoGetBookmarks();
    if(retData){
      res.json(retData);
    } else {
        res.status(500);
        res.json(retData);
    }
	res.end();
});


// @ ROUTE  Add new category
app.post('/add-category', async (req, res) => {
    const reqData = req.body;
    var timestamp = new Date().valueOf();
    var category = {
        "_id": timestamp,
        "category_name": reqData.category_name,
        "category_order": reqData.category_order,
        "category_owner": reqData.category_owner,
    }

    console.log(" > Endpoint > Adding new category: ", category)
    var returnedStatus = await database.mongoSaveCategory(category);
    var ret = JSON.parse(returnedStatus);
    if(ret.status == "success"){
        res.send(returnedStatus);
    } else {
        res.send(ret);
    }
});


// @ ROUTE  Add new bookmark
app.post('/add-bookmark', async (req, res) => {
    const reqData = req.body;
    var timestamp = new Date().valueOf();
    var bookmark = {
        "_id": timestamp,
        "bookmark_name": reqData.bookmark_name,
        "bookmark_alias": reqData.bookmark_alias,
        "bookmark_image": reqData.bookmark_image,
        "bookmark_url": reqData.bookmark_url,
        "bookmark_order": reqData.bookmark_order,
        "bookmark_category": reqData.bookmark_category == null ? "0" : reqData.bookmark_category,
        "bookmark_owner": reqData.bookmark_owner == null ? "0" : reqData.bookmark_owner,
    }
    console.log(" > Endpoint > Adding new bookmark: ", bookmark)

    var returnedStatus = await database.mongoSaveBookmark(bookmark);
    var ret = JSON.parse(returnedStatus);
    if(ret.status == "success"){
        res.send(returnedStatus);
        // Send event over sockets and inform server to restart the subscription process
    } else {
        res.send(ret);
    }
});

// ## Update Bookmark details
app.post('/bookmark/edit', async (req, res) => {
    const bookmarkData = req.body;
    var returnedStatus = await database.mongoUpdateBookmark(bookmarkData);
    var ret = JSON.parse(returnedStatus);
    res.send(ret);
});

// ## Delete bookmark
app.post('/bookmark/delete', async (req, res) => {
    const bookmarkData = req.body;
    var returnedStatus = await database.mongoDeleteBookmark(bookmarkData);
    var ret = JSON.parse(returnedStatus);
    res.send(ret);
});


// ## Delete category
app.post('/category/delete', async (req, res) => {
    const categoryData = req.body;
    var returnedStatus = await database.mongoDeleteCategory(categoryData);
    var ret = JSON.parse(returnedStatus);
    res.send(ret);
});

// ## Update Bookmark details
app.post('/category/edit', async (req, res) => {
    const categoryData = req.body;
    var returnedStatus = await database.mongoUpdateCategory(categoryData);
    var ret = JSON.parse(returnedStatus);
    res.send(ret);
});

// @ Get all bookmarks with categories
app.post('/agregated', async (req, res) => {
    const owner = req.body;
    res.status(200);
    var categoriesData = await database.mongoGetCategories(owner.category_owner);
    var bookmarksData = await database.mongoGetBookmarks(owner.bookmark_owner);

    // add uncategorized category on the fly
    categoriesData.push({
        id: 0,
        category_name: "Uncategorized",
        category_order: 999999,
        bookmarks: []
    });

    // add bookmarks to categories
    var retData = [];
    if(categoriesData && bookmarksData){ // 
        categoriesData.forEach(category => {
            var bookmarks = [];
            bookmarksData.forEach(bookmark => {
                if(bookmark.bookmark_category == category.id){
                    bookmarks.push(bookmark);
                }
            });
            category.bookmarks = bookmarks;
            retData.push(category);
        });
        res.json(retData);
    } else {
        var ret = {"status": "error", "message": "No data available"};
        res.json(ret);
    }
	res.end();
});
