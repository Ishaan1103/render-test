import mongoose from "mongoose";
import 'dotenv/config'

mongoose.set('strictQuery',false)

mongoose.connect(process.env.MONGODB_URL)
.then(result => {
    console.log(`connected to MongoDB ${result}`);
})
.catch(err=>{
    console.log(`error connect to MongoDB ${err}`);
})

const notesSchema = new mongoose.Schema({
    content: {
        type:String,
        minLength: 5,
        require: true
    },
    important: Boolean
})

notesSchema.set('toJSON',{
    transform:(documet,resbody)=>{
        resbody.id = resbody._id.toString()
        delete resbody._id;
        delete resbody.__v;
    }
})

export default mongoose.model('Note',notesSchema)