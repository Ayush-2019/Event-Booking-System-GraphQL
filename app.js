const express = require('express');
const bodyparser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isauth = require('./middlewares/isauth');

const app = express();

app.use(bodyparser.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers',' Content-Type,Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next();
});

app.use(isauth);



app.use('/graphql',
graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolvers,
    graphiql:true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ucfrjku.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3001,() => {
        console.log('App listening at 3001')
    });
})
.catch(err => console.log(err))

