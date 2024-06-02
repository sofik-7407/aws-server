const permissionController = require("../controller/permission");


//set Rotes for User routers
const setRouter=(app)=>{

    app.post(`/aws-permission`,permissionController.serverPermission);
       
}

module.exports={
    setRouter:setRouter
}