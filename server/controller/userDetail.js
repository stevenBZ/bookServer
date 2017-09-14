const User = require('../db.js').UserDetail;
//数据库的操作

//找到所有用户
const findAllUsers = () => {
    return new Promise((resolve, reject) => {
        User.find({}, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//删除某个用户
const updateUserDetails = function(params){
    let username=params.username;
    let country=params.country;
    console.log(username);
    console.log(country);
    return new Promise(( resolve, reject) => {
        User.findOneAndUpdate({ username: username }, {username:username,country:country},err => {
            if(err){
                reject(err);
            }
            console.log('更新用户成功');
            resolve();
        });
    });
};

//获得所有用户信息
const GetAllUsers = async( ctx ) => {
    //查询所有用户信息
    let doc = await findAllUsers();
    ctx.status = 200;
    ctx.body = {
        succsess: '成功',
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
//获得某个用户信息
const GetUserDetail = async( ctx ) => {
    // console.log(ctx.query);
    let username=ctx.query.name;
    //查询所有用户信息
    let doc = await findUserDetail(username);
    if(!doc){
        ctx.status = 200;
        ctx.body = {
            succsess: '不存在该用户'
        };
    }
    else {
        ctx.status = 200;
        ctx.body = {
            succsess: '成功',
            result: doc
        };
    }
};

///更新用户的详细信息 data:JSON
const UpdateUserDetails=async(ctx)=>{
    let fields=ctx.request.body;
    let username=fields.username;
    let country=fields.country;
    let params={
        username:username,
        country:country
    }
    console.log(params);
    await updateUserDetails(params);
    ctx.status = 200;
    ctx.body = {
        success: '更新成功'
    };
};




module.exports = {
    GetUserDetail,
    GetAllUsers,
    UpdateUserDetails
};