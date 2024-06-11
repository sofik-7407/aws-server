const userController = require("../controller/user");
const validator=require('../middleware/validator')

//set Rotes for User routers
const setRouter=(app)=>{
    
    app.post(`/login`,validator.loginValidate,userController.login);
    app.post(`/register`,validator.registerValidate,userController.register);
}

module.exports={
    setRouter:setRouter
}