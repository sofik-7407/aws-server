const mongoose = require("mongoose");
const axios = require('axios');
const hotelModel = require('../model/hotel');
const permissionModel = require('../model/permission');
const userHotelMappingModel = require("../model/userHotelMapping");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");

// add new hotel
const addHotel = async (req, res) => {
  try {
    const {hotelName,hotelId,rating,price}=req.body;
    const newHotel = new hotelModel({
        hotelId,
        hotelName,
        rating,
        price
    })
    await newHotel.save();
    const apiResponse = responseLib.generate(true,"Hotel added successfully",{});
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};

//Book hotel by it's id
const bookHotel = async (req, res) => {
    try {
      const {bookingId,userId,hotelId,checkIn,checkOut,guests} = req.body;
      let permission = await permissionModel.findOne({});
      
      if (permission.permission === false) {
        const apiResponse = responseLib.generate(false, "Permission denied by AWS server", {});
        return res.status(200).send(apiResponse);
      }
      const hotel = await hotelModel.findOne({ hotelId,isAvailable: true });
      console.log("hotel", hotel)
      if(!hotel) {
        return res.status(200).send({success: false, message: "No hotel available",data:{}});
      }
      hotel.isAvailable = false;
      await hotel.save();
      const bookingData = {
        bookingId,
        userId,
        hotelId,
        checkIn,
        checkOut,
        guests
      };
      
      // Define the URL of the API endpoint
      const serviceUrl = 'https://render-server-1oni.onrender.com/book-hotel';

      // Make the POST request using Axios
      const data = await axios.post(serviceUrl, bookingData)
      console.log("response ---->",data.data);
      if(data.data){
        const userHotelMapping = new userHotelMappingModel({
          bookingId,
          userId,
          hotelId,
          bookingDate:Date.now(),
          checkIn,
          checkOut,
          guests
        })
        await userHotelMapping.save();
      }
      const apiResponse = {success:true,message:"Hotel booked successfully",data:data.data};
      res.status(200).send(apiResponse);
    } catch (err) {
      const apiResponse = responseLib.generate(false, err.message,{});
      res.status(500).send(apiResponse);
    }
  };
  
  

//get all the available hotels
const getAvailableHotels = async (req, res) => {
  try {
    const hotelList = await hotelModel.find({isAvailable: true});
    const message = hotelList.length > 0 ? "Available hotels are following" : "No hotel available";
    const apiResponse = { success: true, message, hotelList };
    res.status(200).send(apiResponse);
  } catch (error) {
    const apiResponse = responseLib.generate(false, error.message, {}); // Assuming responseLib is defined elsewhere
    res.status(500).send(apiResponse);
  }
}



module.exports = {
  addHotel:addHotel,
  bookHotel:bookHotel,
  getAvailableHotels:getAvailableHotels
};
