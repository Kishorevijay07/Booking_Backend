import mongoose from "mongoose";


const authschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    clodinaryurl:{
        type:Array,
        default:[]
    },
    booked:{
        type:Array,
        default:[]
    },
    createattime:{
        type:Date,
        default:Date.now
    },

})

const User = mongoose.model("User",authschema);
export default User;