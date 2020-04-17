require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphQlHTTp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
const events = [];
app.use(bodyParser.json());

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
                return events;
            },
            createEvent: (args) => {
                const event = {
                    _id: Math.random().toString(),
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: args.eventInput.date,
                };
                events.push(event);
                return event;
            },
        },
        graphiql: true,
    })
);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
