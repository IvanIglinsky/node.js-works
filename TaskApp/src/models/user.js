const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Email doesn`t coreespond Email Format")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minLength:7,
        validator(value){
            if(value==="password"){
                throw new Error("Your password not be have word password")
            }
        }
    },
    firstName: {
        type: String,
        required: true,
        trim:true
    },
    lastName: {
        type: String,
        required: true,
        trim:true
    },
    age: {
        type: Number,
        validator(value){
            if(value<0){
                throw new Error("Age must be a positive number")
            }
            else if(value>110){
                throw new Error("You are life now?")
            }

        },
        default:0

    },
    tokens:[{
        token:{
           type:String,
           required:true
        }
    }]}
    ,{toJSON:{virtuals:true},toObject:{virtuals:true}})

userSchema.virtual('tasks',{
    ref:"Task",
    localField:'_id',
    foreignField:'owner'
})
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,8)
    }
    next();
})

userSchema.statics.findOneByCredentials=async (email,password)=>
{
    const user=await  User.findOne({email});
    if(!user){
        throw  new Error("User not found");
    }
    const isMatch=await  bcrypt.compare(password, user.password)
    if(!isMatch){
       throw  new Error('Incorrect password')
    }
    return user;
}
userSchema.methods.generateAuthToken=async function(){
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},process.env.KEY,{expiresIn:"24h"})
    user.tokens=user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON=function (  ){
    const userObject=this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

const User = mongoose.model("User", userSchema)

module.exports = User