# Challengeverse
:alien: Another coding challenge repository. 

## About
Challenge verse is a very simple demo coding platform for NodeJs Skills evaluation. 

It's a restfull API aimed to restaurants and delivery context. 


## Installation and running
1. First at all, you have to run `npm install` on each submodule folders. In this project, you will have two main modules:

    * API module, is responsible for attend client request and serve a very fast response ;)

    * DB module or challenverse-db, responsible to manage db connections, handle db errors, etc. This module provides Concrete classes that give a complete abstracction of db, and could be called from another module as if they where microservices. 

2. Start api module by running `npm run start-dev` on api submodule. 

3. Execute setup script in DB module to generate database schema. So, you have to run `npm run setup` and then,

4. you can load example data by running `node examples` into challengverse-db module.

## Env Configuration
All modules are configurable by setting some NODE_ENV's variables: 

```js
    database: process.env.DB_NAME || 'challengeverse',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.PORT 
```
Database dialects is *Mysql* harcoded. 

Example `DB_HOST=192.168.50.145 DB_PORT=3354 node server.js` into challengeverse-api module


## Usage

In browser or another http client, you can request challengeverse API. Default listen port is 3000. Obviously, you can change this by setting node env variable **API_PORT**. 

## Enabled endpoints

1. *GET*    /restaurants/
2. *GET*    /restaurants/:id
3. *DELETE* /restaurants/:id
4. *PUT*    /restaurants/:id
5. *POST*   /restaurants/:id/reviews

```js
        //Example body request
        {
            "name":"Santiago Semhan",
            "review": "...",
            "rating": 5
        }
```
6. *POST*   /restaurants/:id/meal
7. *POST*   /restaurants/:id/order

```js
        //Example body request
        {
            "totalCost": 58,
            "address": "test address",
            "latLng":{
                "lat":37.769808,
                "lng":-122.4705595
            },
            "meals": [1,2,3] //Arrays of meals Ids
        }
```
:construction: Better doc under construction ...

Author: Santiago Semhan <santiagosemhan@gmail.com> 🇦🇷

License: MIT :heart:

