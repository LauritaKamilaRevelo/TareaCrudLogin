import mongoose, {Document, Schema}from "mongoose";

export interface IUser extends Document{
    nombre: string;
    email: string;
    password: string;
    createdAt: Date;
}

const UserSchema : Schema = new Schema({
    nombre:{
        type : String,
        require : true,
        trim : true
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        require: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IUser>('User', UserSchema);

