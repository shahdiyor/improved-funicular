const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {jwtkey} = require('../keys');
const router = express.Router();
const User = mongoose.model('User');


router.post('/signup',async (req,res)=>{
   
    const {email,password,fio,post,color} = req.body;
    
    try{
      const user = new User({email,password,fio,post,color});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey);
      res.send({token});
    }catch(err){
      return res.status(422).send(err.message);
    }
});

router.post('/signin',async (req,res)=>{
  console.log('signin start');
    const {email,password} = req.body
    if(!email || !password){
      console.log('error');
        return res.status(422).send({error :"Номер телефона или пароль введены не правильно!"});
    }
    const user = await User.findOne({email})
    if(!user){
      console.log('error');
        return res.status(422).send({error :"Номер телефона или пароль введены не правильно!"})
    }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey);
      console.log('Excellent');
      res.send({token,fio:user.fio,post:user.post,color:user.color});
    }catch(err){
      console.log('error');
        return res.status(422).send({error :"Номер телефона или пароль введены не правильно!"+err})
    }
})


module.exports = router