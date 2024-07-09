const hotelController = require("../controller/hotel");
const auth=require('../middleware/auth')
const validator=require('../middleware/validator')

//set Rotes for User routers
const setRouter=(app)=>{
    
    app.post(`/add-hotel`,hotelController.addHotel);
    app.post(`/book-hotel`,hotelController.bookHotel);
    app.get(`/get-hotel`,hotelController.getAvailableHotels);

}

module.exports={
    setRouter:setRouter
}