const UserController = require('../controller/user.js');
const UserDetailController = require('../controller/userDetail.js');
const BookController = require('../controller/book.js');
const DefaultController = require('../controller/default.js');
const ChatHistoryController=require('../controller/chatHistory.js')
const Router = require('koa-router');

const childRouter = new Router();

//checkToken作为中间件存在
const checkToken = require('../token/checkToken.js');
childRouter.post('/login', UserController.Login);
childRouter.post('/register', UserController.Reg);
childRouter.post('/sendMessage', ChatHistoryController.PostMessage);
childRouter.get('/getChatHistory', ChatHistoryController.GetChatHistory);
childRouter.get('/getChatList', ChatHistoryController.GetChatList);
childRouter.get('/getUsers', UserController.GetAllUsers);
childRouter.get('/getUserDetail', UserDetailController.GetUserDetail);
childRouter.post('/doCollection', UserDetailController.DoCollection);
childRouter.get('/getAllUserDetails', UserDetailController.GetAllUsers);
childRouter.post('/updateUserDetails', UserDetailController.UpdateUserDetails);
childRouter.post('/upload/uploadBook', BookController.SaveBook);
childRouter.get('/getBookData', BookController.GetAllBooks);
childRouter.get('/delBooks', BookController.DelBooks);
childRouter.get('/getMyBookList', BookController.GetMyBooks);
childRouter.get('/getMyCollectionBooks', BookController.GetMyCollectionBooks);
childRouter.get('/test', DefaultController.test);

//需要先检查权限的路由
childRouter.get('/user', checkToken, UserController.GetAllUsers);
childRouter.post('/delUser', checkToken, UserController.DelUser);
childRouter.get('/haveLogin', checkToken,DefaultController.test);

module.exports = childRouter;