const express = require ( "express" )
const mongoose = require ( "mongoose" )
const User = require ( "./models/user" )
const Task = require ( "./models/task" )
const mongodb = require ( "mongodb" );
const objectId = mongodb.ObjectId;
const auth = require ( "./middleware/auth" )

require ( "dotenv" ).config (); //process.env

let url = process.env.MONGO_URL;
let port = process.env.PORT;

mongoose.connect ( url )

const app = express ();
app.use ( express.json () );
// app.use(auth)

app.get ( "/users" , async ( req , res ) => {
    try {
        const users = await User.find ();
        res.json ( users );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.get ( "/users/:id" , async ( req , res ) => {
    try {
        const id = new objectId ( req.params.id );
        const user = await User.findOne ( { _id : id } )
        await user.populate('tasks');
        res.json ( user )

    } catch (error) {
        res.send ( error.message );
    }
} )
app.get ( "/users/me" , auth , async ( req , res ) => {
    res.send ( req.user );
} )



app.post ( "/users" , async ( req , res ) => {
    try {
        const user = new User ( req.body );
        await user.save ()
        res.json ( user );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.post ( "/users/login" , async ( req , res ) => {
    try {
        const user = await User.findOneByCredentials ( req.body.email , req.body.password );
        const token = await user.generateAuthToken ();
        res.send ( { user , token } )
    } catch (e) {
        res.send ( e.message );
    }
} );

app.put ( "/users/:id" , async ( req , res ) => {
    try {

        const user = await User.findOne ( { _id : req.params.id } )
        if( !user ) {
            res.status ( 404 );
            throw new Error ( "User not found" )
        }
        const fields = [ "firstName" , "lastName" , "age" , "password" ];
        fields.forEach ( ( field ) => {
            if( req.body[field] ) {
                user[field] = req.body[field];
            }
        } )
        await user.save ();
        res.json ( user );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.delete ( "/users/:id" , async ( req , res ) => {
    try {
        const id = new objectId ( req.params.id );
        let users = await User.findOneAndDelete ( { _id : id } )

        res.json ( users );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.delete ( "/users" , async ( req , res ) => {
    try {
        let users = await User.find ();
        User.collection.drop ();
        res.json ( users );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.post("/users/logout",auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save()
        res.send({message:"You logout"});
    }
    catch (e){
        res.status(500).send()
    }
})
app.get("/users/logoutAll",auth, async (req,res)=>{
    try{
        let users = await User.find ();
        users.forEach(async (user)=>{
            req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token !== req.token;
            })
            await req.user.save()
            res.send({message:"ALL logout"});
        })
      res.send({message:"All logout"})
    }
    catch (e){
        res.status(500).send()
    }
})


//Task

app.post ( "/tasks/login" , async ( req , res ) => {
    try {
        const user = await User.findOneByCredentials ( req.body.email , req.body.password );
        const token = await user.generateAuthToken ();
        res.send ( { user , token } )
    } catch (e) {
        res.send ( e.message );
    }
} );

app.post ( "/tasks" ,auth, async ( req , res ) => {
        const task = new Task ( {...req.body,owner:req.user.id} );
    try {
        await task.save ()
        res.status(201).send(task);
    } catch (error) {
        res.send ( error.message );
    }
} )
app.get ( "/tasks" ,auth, async ( req , res ) => {
        const userId=new objectId(req.user.id);
        const task = await Task.find ({owner:userId});
    try {
        res.json ( task );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.get ( "/tasks/:id" ,auth, async ( req , res ) => {
    try {
        const id = new objectId ( req.params.id );
        const userId=new objectId(req.user.id);
        const task = await Task.findOne ( { _id : id,owner: userId } )
        if(!task){
            return res.status(404).send('Task not found')
        }
        await task.populate('owner');
        res.json ( task )
    } catch (error) {
        res.send ( error.message );
    }
} )
app.put ( "/tasks/:id" , async ( req , res ) => {
    try {
        const id = new objectId ( req.params.id );
        let task = await Task.findOneAndUpdate ( { _id : id } , {
            $set : {
                title : req.body.title ,
                description : req.body.description ,
                completed : req.body.completed
            }
        } );
        res.json ( task );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.delete ( "/tasks/:id" , auth,async ( req , res ) => {
    try {
        const userId=new objectId(req.user.id);
        const id = new objectId ( req.params.id );
        let task = await Task.findOneAndDelete ( { _id : id,owner:userId } )
        res.json ( task );
    } catch (error) {
        res.send ( error.message );
    }
} )
app.delete ( "/tasks" , async ( req , res ) => {
    try {
        let tasks = await Task.find ();
        Task.collection.drop ();
        res.json ( tasks );
    } catch (error) {
        res.send ( error.message );
    }
} )

app.listen ( port , () => {
    console.log ( `Server is listening on ${port} port` )
} )