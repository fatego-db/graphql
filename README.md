# FateGo Graphql Server
A Graphql API server for basic FateGo data.

## Try it out
Here is the link to a hosted instance: https://fatego-db.herokuapp.com/graphql

**Note** This is a free tier heroku app so it might take a bit for it to spin up a
dyno.

## Want to Contribute?
This started as a pet project for me to learn and mess around with graphql.
If you are interested in contributing, please do! Create an issue on what you
plan on doing, get some feedback from a contributor, and start working on a
pull request. This project is still pretty early in development so there
is plenty to do.

## Development
1. `yarn install` or `npm install`
2. Create `.env` with
```
MONGO_URI=mongodb://<username>:<password>@<endpoint>:<port>/<db>
```
3. Use [webscrapper](https://github.com/fatego-db/webscrapper) to
import data to local or remote mongodb.

## Features
- [x] Basic Servant Query
- [x] Basic Skill Query
- [ ] Material Query
- [ ] Craft Essence Query
