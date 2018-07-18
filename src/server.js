require("dotenv").config()
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const url = process.env.MONGO_URI;

// GraphQL schema
const schema = buildSchema(`
    type Query {
      servant(_id: String, servantId: String): Servant
      servants(_id: String,
               servantId: String,
               name: String,
               class: Class,
               release: Release,
               rating: String): Servants
      skill(_id: String,
            name: String): Skill
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
      _id: String!
      name: String!
      class: Class
      servantId: String!
      release: Release!
      rating: String
      stats: Stat
    },
    type Servants {
      heroes: [Servant]
    },
    type SkillMeta {
      type: String!
      category: String!
    },
    type SkillGrowth {
      level: String!
      effect: String!
      cooldown: String!
    },
    type Leveling {
      enhancement: String!
      growth: [SkillGrowth]!
    },
    type Skill {
      _id: String!
      name: String!
      meta: SkillMeta!
      effects: [String]!
      leveling: Leveling!
    }
`);

const wrapQuery = (query) => {
  if (query._id) {
    query = Object.assign(query, {_id: new ObjectId(query._id)});
  }
  return query;
}

const handleDatabaseError = (error) => {
  console.error(error.message);
  throw new Error("Database connection issue");
}

const getServant = (query) => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => {
      const db = client.db("fatego-db");
      const servants = db.collection("servants");
      return servants.findOne(wrapQuery(query));
    })
    .then((servant) => {
      console.log(servant.name);
      return servant;
    })
    .catch(handleDatabaseError);
};

const getServants = (query) => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => {
      const db = client.db("fatego-db");
      const servants = db.collection("servants");
      return servants.find(wrapQuery(query)).toArray();
    })
    .then((servants) => {
      servants.forEach((servant) => console.log(servant.name));
      return {heroes: servants};
    })
    .catch(handleDatabaseError);
};

const getSkill = (query) => {
  return MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => {
      const db = client.db("fatego-db");
      const skills = db.collection("skills");
      return skills.find(wrapQuery(query), {_id: 0}).toArray();
    })
    .then((skills) => {
      skills.forEach((skill) => console.log(skill.name));
      return (skills.length > 0) ? skills[0] : undefined;
    })
    .catch(handleDatabaseError);
};

// Root resolver
const root = {
  servant: getServant,
  servants: getServants,
  skill: getSkill
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
