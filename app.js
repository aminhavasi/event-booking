require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const graphQlHTTp = require('express-graphql');
const { buildSchema } = require('graphql');
const app = express();
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

        type RootMutation{
            createEvent(title:String!,description:String!,price:Float!,date:String!):Event

        }

        schema{
            query:RootQuery


            mutation:RootMutation
        }
        `),
        rootValue: {
            events: () => {
                return ['ssd', 'All-Night Coding'];
            },
            createEvent: (args) => {
                const eventName = args.name;
                return eventName;
            },
        },
        graphiql: true,
    })
);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
