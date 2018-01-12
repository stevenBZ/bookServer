const Book = require('../db.js').Book;
const User = require('../db.js').UserDetail;
const mongoose = require('mongoose');
const fs = require('fs');
const { URL } = require('url');
//下面这两个包用来生成时间
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
//用于密码加密
// const sha1 = require('sha1');
//createToken
const createToken = require('../token/createToken.js');
// const asyncBusboy =require('async-busboy');
function getImgName(filePath){
    var fileArray=filePath.split('/');
    var len=fileArray.length;
    var imgName=fileArray[len-1];
    var res=__dirname+'/static/loadImg/'+imgName;
    return res;
}

function getImgUrl(filePath){
    var fileArray=filePath.split('/');
    var len=fileArray.length;
    var imgName=fileArray[len-1];
    var res="http://localhost:8888/server/controller/static/loadImg/"+imgName;
    return res;
}

//上传
const SaveBook = async ( ctx ) => {
     // const {files, fields} = await asyncBusboy(ctx.req);
    // var form = new formidable.IncomingForm();
    var fields=ctx.request.body;
    var _id=fields._id;
    var ctxTitle=fields.title;
    var ctxFile=fields.path;
    var ctxAuthor=fields.author;
    var ctxIntro=fields.intro;
    var contentText = fs.readFileSync(ctxFile);
    var filePath=getImgName(ctxFile);
    var fileUrl=getImgUrl(ctxFile);
    fs.writeFile(filePath, contentText,'binary', function(err){
        if(err){
            console.log("down fail");
        }
        else{console.log("down success");}
    });
    let book = new Book({
        _id:_id,
        title: ctxTitle,
        uri: filePath,
        author:ctxAuthor,
        intro:ctxIntro,
    });
    //将objectid转换为用户创建时间(可以不用)
    book.create_time = moment(objectIdToTimestamp(book._id)).format('YYYY-MM-DD');


   if(book.title){
        await new Promise((resolve, reject) => {
            book.save((err) => {
                if(err){
                    reject(err);
                }
                resolve();
            });
        });
        ctx.status = 200;
        ctx.body = {
            success: true
        }
    }
};

//找到所有书籍
const findAllBooks = () => {
    return new Promise((resolve, reject) => {
        Book.find({}, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//找到某个用户的所有书籍
const findMyBooks = (username) => {
    return new Promise((resolve, reject) => {
        Book.find({author:username}, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//根据id查找书籍
const findBookById = (id) => {
    return new Promise((resolve, reject) => {
        Book.findById(id, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//删除所有书籍信息
const DelBooks = function(){
    return new Promise(( resolve, reject) => {
        Book.remove({}, err => {
            if(err){
                reject(err);
            }
            resolve();
        });
    });
};
//获得所有用户信息
const GetAllBooks = async( ctx ) => {
    //查询所有用户信息
    let doc = await findAllBooks();
    ctx.status = 200;
    ctx.body = {
        success: true,
        result: doc
    };
};

//获得某用户的书籍信息
const GetMyBooks = async( ctx ) => {
    const username=ctx.query.username;
    //查询所有用户信息
    let doc = await findMyBooks(username);
    ctx.status = 200;
    ctx.body = {
        success: true,
        result: doc
    };
};
//根据用户名查找用户
const findUserDetail = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username }, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};
//获得某用户收藏的书籍信息
const GetMyCollectionBooks = async( ctx ) => {
    const username=ctx.query.username;
    //查询所有用户信息
    let userInfo = await findUserDetail(username); 
    let res=[]
    if(userInfo){
        let userCollection=userInfo.myCollection
       
        for(let i=0;i<userCollection.length;i++){
            var doc=await findBookById(userCollection[i]) 
            res.push(doc)
        }
    }
    ctx.status = 200;
    ctx.body = {
        success: true,
        result: res
    };
};

module.exports = {
    SaveBook,
    GetAllBooks,
    DelBooks,
    GetMyBooks,
    GetMyCollectionBooks
};