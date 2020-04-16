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

        type RootQuery{
            events:[String!]!

        }

        type RootMutation{
            createEvent(name:String):String

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
