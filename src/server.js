require("dotenv").config()
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const MongoClient = require("mongodb").MongoClient;

const url = process.env.MONGO_URI;

// GraphQL schema
const schema = buildSchema(`
    type Query {
        servants(servantId: String, name: String, class: Class, release: Release, rating: String): Servants
    },
    enum Release {
      JP
      NA
    },
    enum Class {
      saber
      archer
      lancer
      assassin
      rider
      caster
      berserker
      shielder
      alterego
      ruler
      avenger
      foreigner
      mooncancer
      beast
      unclassified
    },
    type Stat {
      attack: [Int!]
      hp: [Int!]
    },
    type Servant {
      name: String!
      class: Class
      servantId: String!
      release: Release!
      rating: String
      stats: Stat
    },
    type Servants {
      heroes: [Servant]
    }
`);

const getServants = (query) => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => {
      const db = client.db("fatego-db");
      const servants = db.collection("servants");
      return servants.find(query, {_id: 0}).toArray();
    })
    .then((servants) => {
      console.log(servants);
      return {heroes: servants};
    })
    .catch((error) => {
      console.error(error.message);
      throw new Error("Database connection issue");
    });
}

// Root resolver
const root = {
    servants: getServants
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    console.log("Express GraphQL Server Now Running On localhost:4000/graphql")
  }
});
