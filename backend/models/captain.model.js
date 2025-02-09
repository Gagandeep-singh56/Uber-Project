
const mongoose=require('mongoose');  
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
 const CaptainSchema=new mongoose.Schema({
     fullname:{
     firstname:{
        type:String,
        required:true,
        minlength:[3,"First name must be at least 3 characters long"]
     },
     lastname:{
        type:String,
        minlength:[3,"Last name must be at least 3 characters long"],
     }
     },
     email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,"Email must be at least 5 characters long"],
     },
     password:{
        type:String,
        required:true,
        minlength:[9,'Min length should be 9 '],
        select:false,   
        validate:[
            {
                validator:function(value){
                    return /\d/.test(value);
                },
                message:'Password must contain at least one numeric digit.'
            },
            {
                validator:function(value)
                {
                    return /[A-Z]/.test(value)
                },
                message:'Password must contain at least one uppercase letter.',
            }]  
       },
     SocketId:{
        type:String,
     },
     vechile:{
        color:{
            type:String,
            required:true,
            minlength:[3,"color must be at least 3 characters"],
        },   
        plate:{
            type:String,
            required:true,
            minlength:[3,"color must be at least 3 characters"],
        },
        Vechiletype:{
            type:String,
            enum:['bike','car','auto'],
            required:true,
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,"Capacity must be at least 1"],
        }

    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    location:{
        lat:{
            type:Number,
        }
        ,long:{
            type:Number,
        }
    }

 });
 

CaptainSchema.methods.generateAuthToken = async function() {
    try {
        const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        return token;
    } catch (error) {
        console.log("error while generating token", error);
        throw error;
    }
}

CaptainSchema.methods.HashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}
CaptainSchema.methods.ComparePasswords = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log("error while comparing passwords", error);
        throw error;
    }
}   
const Captainmodel=mongoose.model('Captain',CaptainSchema);
module.exports=Captainmodel;