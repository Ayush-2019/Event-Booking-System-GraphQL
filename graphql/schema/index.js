const {buildSchema} = require('graphql');

module.exports = buildSchema(`

type Booking{
    _id:ID!
    event: Event!
    user:User!
    createdAt:String!
    updatedAt:String!
}
type Event {
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creater:User!
}

type User {
    _id:ID!
    email:String!
    password:String
    createEvents:[Event!]
}

type Auth{
    userID:ID!
    token:String!
    tokenexpire:Int!
}

input EventInput {
    title:String!
    description:String!
    price:Float!
    date:String!
}
input UserInput{
    email:String!
    password:String!
}

type RootQuery {
    events: [Event!]!
    bookings:[Booking!]!
    signin(email:String!, password:String!):Auth!

}

type RootMutation {
    createEvents(eventInput:EventInput):Event
    createUser(userInput:UserInput):User
    bookEvent(eventID:ID!):Booking!
    cancelBooking(bookingID:ID!):Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)