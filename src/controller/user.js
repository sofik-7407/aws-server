const mongoose = require("mongoose");
const userModerl = require('../model/user');
const tokenLib = require("../libs/tokenLib");
const passwordLib = require("../libs/passwordLib");
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");


// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDetails = await userModerl.findOne({email});
    if(checkLib.isEmpty(userDetails)){
      const apiResponse = responseLib.generate(false,"email not registered",{});
      return res.status(200).send(apiResponse);
    }
    if (await passwordLib.verify(password,userDetails.password)) {
      console.log("Verified");
      let payload = {
        exp: "2 hours",
        token: await tokenLib.generateToken(userDetails),
      };
      let apiResponse = responseLib.generate(true, "Verification successfull", payload);
      res.status(200).send(apiResponse);
    } else {
      const apiResponse = responseLib.generate(false,"Incorrect password",{});
      res.status(200).send(apiResponse);
    }
  } catch (err) {
    const apiResponse =await responseLib.generate(false, err.message, {});
    res.status(500).send(apiResponse);
  }
};

//Registration
const register = async (req, res) => {
  try {
    console.log("request body ------>",req.body);
    const {name,userId,email,password,address} = req.body;
    const isUserExist = await userModerl.findOne({email});
    if(isUserExist){
      const apiResponse = responseLib.generate(false,"This email is already registered",{});
      return res.status(200).send(apiResponse);
    }
    let newUser = new userModerl({
      userId:userId,
      name:name,
      password: await passwordLib.hash(password),
      email:email,
      address : address
    });
    await newUser.save();
    const apiResponse = {success:true,message:"User Registered Success",userId};
    res.status(200).send(apiResponse);
  } catch (err) {
    const apiResponse = responseLib.generate(true, err.message, null);
    res.send(apiResponse);
  }
};



module.exports = {
  login: login,
  register: register
};
