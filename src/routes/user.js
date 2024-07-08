const userController = require("../controller/user");
const validator=require('../middleware/validator')

//set Rotes for User routers
const setRouter=(app)=>{
    
    app.post(`/login`,userController.login);
    app.post(`/register`,userController.register);
}

module.exports={
    setRouter:setRouter
}