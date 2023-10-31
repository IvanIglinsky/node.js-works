require("dotenv").config();
const mongourl = process.env.MONGO_URL;
let server = "http://localhost:3000";

const users = [
    { email: 'jane@gmail.com', password: '1234', firstName: "Jane", lastName: "Smith", age: 42 },
    { email: 'jane@gmail.com', password: '12345678', firstName: "Jane", lastName: "Smith", age: 42 },
    { email: 'john@gmail.com', password: '12345678', firstName: "Jane", lastName: "Smith", age: 42 },
];
const task = [
    { title: "task1", description: "desc of task1", completed: "true" }
];
let tempToken = ''
let tempTask1ID = ''
let mongoose = require("mongoose");
mongoose.connect(mongourl);

let User = require('../src/models/user');
let Task = require('../src/models/task');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('TaskApp', () => {
    before ( async function () {
        await User.deleteMany ( {} );
        await Task.deleteMany ( {} );
    } );

    describe ( 'Scenario #1' , () => {
        describe ( 'Requests' , () => {
            it ( '1. /users fail' , ( done ) => {

                chai.request ( server )
                    .post ( '/users' )
                    .send ( users[0] )
                    .end ( ( err , res ) => {
                        res.should.have.status(200);
                        res.text.should.be.eql('User validation failed: password: Path `password` (`1234`) is shorter than the minimum allowed length (7).');
                        done ()
                    } )
            } )

            it ( '2. /users success' , ( done ) => {

                chai.request ( server )
                    .post ( '/users' )
                    .send ( users[1] )
                    .end ( ( err , res ) => {
                        try {
                            res.should.have.status ( 200 )
                            res.body.should.have.property ( '_id' )
                            done ()
                        } catch (e) {
                            done ( e )
                        }
                    } )
            } )

            it ( '3. /users success' , ( done ) => {

                chai.request ( server )
                    .post ( '/users' )
                    .send ( users[2] )
                    .end ( ( err , res ) => {
                        try {
                            res.should.have.status ( 200 )
                            res.body.should.have.property ( '_id' )
                            done ()
                        } catch (e) {
                            done ( e )
                        }
                    } )
            } )

            it ( '4. /login success' , ( done ) => {

                chai.request ( server )
                    .post ( '/users/login' )
                    .send ( users[1] )
                    .end ( ( err , res ) => {
                        if( err ) {
                            console.log ( err.message )
                            done ( err )
                        }
                        tempToken = res.body.token
                        res.should.have.status ( 200 )
                        done ()
                    } )
            } )

            it ( '5. /tasks success' , ( done ) => {


                chai.request ( server )
                    .post ( '/tasks' )
                    .set ( 'Authorization' , `Bearer ${tempToken}` )
                    .send ( task[0] )
                    .end ( ( err , res ) => {
                        if( err ) {
                            done ( err )
                        }
                        res.should.have.status ( 201 )
                        res.body.should.have.property ( '_id' )
                        done ()
                    } )
            } )

            it ( '6. /tasks success' , ( done ) => {


                chai.request ( server )
                    .post ( '/tasks' )
                    .set ( 'Authorization' , `Bearer ${tempToken}` )
                    .send ( task[0] )
                    .end ( ( err , res ) => {
                        if( err ) {
                            done ( err )
                        }
                        res.should.have.status ( 201 )
                        res.body.should.have.property ( '_id' )
                        done ()
                    } )
            } )

            it ( '7. /tasks success' , ( done ) => {
                chai.request ( server )
                    .get ( '/tasks' )
                    .set ( 'Authorization' , `Bearer ${tempToken}` )
                    .end ( ( err , res ) => {
                        res.should.have.status ( 200 )
                        res.body.length.should.be.eql ( 2 )
                        tempTask1ID = res.body[0]._id
                        done ()
                    } )
            } )

            it ( '8. /tasks/:id success' , ( done ) => {
                chai.request ( server )
                    .get ( '/tasks/' + tempTask1ID )
                    .set ( 'Authorization' , `Bearer ${tempToken}` )
                    .end ( ( err , res ) => {
                        res.should.have.status ( 200 )
                        res.body.should.have.property ( 'title' )
                        res.body.should.have.property ( 'completed' )
                        done ()
                    } )
            } )

            it ( '9. /logout success' , ( done ) => {
                chai.request ( server )
                    .post ( '/users/logout' )
                    .set ( 'Authorization' , `Bearer ${tempToken}` )
                    .end ( ( err , res ) => {
                        if( err ) {
                            console.log ( err.message )
                            done ( err )
                        }
                        tempToken = ''
                        res.body.message.should.be.eql("You logout");
                        done ()
                    } )
            } )

            it ( '10. /login success' , ( done ) => {

                chai.request ( server )
                    .post ( '/users/login' )
                    .send ( users[1] )
                    .end ( ( err , res ) => {
                        if( err ) {
                            console.log ( err.message )
                            done ( err )
                        }
                        tempToken = res.body.token
                        res.should.have.status ( 200 )
                        done ()
                    } )
            } )
        } )
    } )
})