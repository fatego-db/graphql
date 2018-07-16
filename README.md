# FateGo Graphql Server
A Graphql API server for basic FateGo data.

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
- [ ] Skill Query
- [ ] Material Query
- [ ] Craft Essence Query
