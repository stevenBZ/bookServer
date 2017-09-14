const Book = require('../db.js').Book;
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
    var ctxTitle=fields.title;
    var ctxFile=fields.path;
    var ctxAuthor=fields.author;
    var ctxIntro=fields.intro;
    var contentText = fs.readFileSync(ctxFile);
    var filePath=getImgName(ctxFile);
    var fileUrl=getImgUrl(ctxFile);
    console.log('用户名为:',ctxAuthor);
    // console.log(__dirname);
    fs.writeFile(filePath, contentText,'binary', function(err){
        if(err){
            console.log("down fail");
        }
        else{console.log("down success");}
    });
    let book = new Book({
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
        console.log('上传成功');
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

//删除所有书籍信息
const DelBooks = function(){
    return new Promise(( resolve, reject) => {
        Book.remove({}, err => {
            if(err){
                reject(err);
            }
            console.log('删除用户成功');
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
        succsess: '成功',
        result: doc
    };
};

module.exports = {
    SaveBook,
    GetAllBooks,
    DelBooks
};