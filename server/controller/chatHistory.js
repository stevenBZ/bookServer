const ChatHistory = require('../db.js').ChatHistory;

//根据拥有者名字查找聊天记录
const findChatHistory = (sender,toUser) => {
    return new Promise((resolve, reject) => {
        ChatHistory.findOne({ sender:sender,toUser:toUser }, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//根据拥有者查找所有聊天记录
const findAllChatHistory = (sender) => {
    return new Promise((resolve, reject) => {
        ChatHistory.find({ sender:sender}, (err, doc) => {
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
};

//获得某人与某人的聊天记录
const GetChatHistory = async( ctx ) => {
    let sender=ctx.query.username;
    let toUser=ctx.query.toUser;
    //查询聊天记录
    let doc = await findChatHistory(sender,toUser);
    // console.log(doc)
    ctx.status = 200;
    ctx.body = {
        success: true,
        result: doc
    };
};

//获得某人的聊天记录列表
const GetChatList = async( ctx ) => {
    let sender=ctx.query.username;
    //查询聊天记录
    let doc = await findAllChatHistory(sender);
    ctx.status = 200;
    ctx.body = {
        success: true,
        result: doc
    };
};
const createChatHistory=(sender,toUser,messageData)=>{
    let chatHistory = new ChatHistory({
        sender: sender,
        toUser: toUser,
        chatHistoryList:[messageData]
    });
        chatHistory.save((err) => {
            if(err){
                console.log(err)
            }
        });
}
const updateChatHistory=async (sender,toUser,doc,messageData)=>{
    let _chatHistory=doc['chatHistoryList']?doc['chatHistoryList']:[];
    _chatHistory.push(messageData);
    await new Promise((resolve, reject) => {
    ChatHistory.update({sender:sender,toUser:toUser}, {chatHistoryList: _chatHistory},  function(err, docs){
        if(err){
            reject(err);
        }
        resolve(docs);
    })
  })
}
//发送信息
const PostMessage = async ( ctx ) => {
    let sender = ctx.request.body.sender;
    let toUser = ctx.request.body.toUser;
    let messageData=ctx.request.body.messageData;
    let doc = await findChatHistory (sender,toUser);
    if(!doc){
        createChatHistory(sender,toUser,messageData);
        createChatHistory(toUser,sender,messageData);      
    }else{
        // updateChatHistory(sender,toUser,doc,messageData)
        // updateChatHistory(toUser,sender,doc,messageData)  
        let _chatHistory=doc['chatHistoryList']?doc['chatHistoryList']:[];  
        _chatHistory.push(messageData);    
        await new Promise((resolve, reject) => {
            ChatHistory.update({sender:sender,toUser:toUser}, {chatHistoryList: _chatHistory},  function(err, docs){
                if(err){
                    reject(err);
                }
                resolve(docs);
            })
          })
          await new Promise((resolve, reject) => {
            ChatHistory.update({sender:toUser,toUser:sender}, {chatHistoryList: _chatHistory},  function(err, docs){
                if(err){
                    reject(err);
                }
                resolve(docs);
            })
          })
    }
    ctx.status = 200;
        ctx.body = { 
            success: true,
    };
};

module.exports = {
    PostMessage,
    GetChatHistory,
    GetChatList 
};