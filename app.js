require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphQlHTTp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./src/models/events');
const app = express();
const events = [];
app.use(bodyParser.json());
mongoose.connect(process.env.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

app.use(
    '/graphql',
    graphQlHTTp({
        schema: buildSchema(`

        type Event{
            _id:ID!
            title:String!
            description:String!
            price:Float!
            date:String!
        }
        

        type RootQuery{
            events:[Event!]!

        }
        input inputEvent{
             title:String!
             description:String!
             price:Float!
             date:String!
        }

        type RootMutation{
            createEvent(eventInput:inputEvent):Event

        }

        schema{
            query:RootQuery


            mutation:RootMutation
        }
        `),
        rootValue: {
            events: () => {
                return Event.find({})
                    .then((events) => {
                        // return events.map((e) => {
                        //     return { ...e._doc };
                        // });
                        return events;
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                });
                return event
                    .save()
                    .then((result) => {
                        console.log(result);
                        return {
                            ...result._doc,
                        };
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            },
        },
    })
);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
