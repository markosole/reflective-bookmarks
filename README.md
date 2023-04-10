# Bookmar Manager + NodeJS + VUE

This is simple Bookmark Dashboard Manager, one of many out there but has something that others do not offer. 
Built with idea to replace your Browser default page and allow you to convert it into large Bookmark dashboard.
It is based on NodeJS express server, MongoDB and VUE3 app as a frontend.


![alt text](https://github.com/markosole/reflective-bookmarks/blob/main/demo/bookmarks.png)

![alt text](https://github.com/markosole/reflective-bookmarks/blob/main/demo/profile.png)

## Features

- ✅ Self Hosted & Open Source
- ✅ Runs as a Docker and as standalone NodeJS + MongoDB + VUE3 app
- ✅ Multiuser interface (profiles similar to Netflix) with simple switching
- ✅ Setup on the local network and Online for team sharing
- ✅ Categories with ordering
- ✅ Bookmarks drag & drop ordering
- ✅ Export each profile's bookmarks export as JSON file
- ❎ Bookmark import (ToDo)

# Configuration
To run in production and on your public domain, set your FQDN.


## Production Docker environment
VUE App sill be compiled, placed in `/server/public` folder after compile time and served from NodeJS Express (API) application.

### Define your domain
Set your domain in `/server/.env` replace *example.com* with your FQDN.

```
SERVER_HOST=http://example.com
```

# Runs in Docker
Application will be hosted on default port 80. Modify Docker Compose file if you need different external port `80:5001`. API will run internally on port 5001 by default.

```bash
docker-compose up -d --build
```

No chache & Force recreate
```Shell
docker-compose build --no-cache && docker-compose up -d --force-recreate
```

Docker Compose:

```Yaml
version: '3'
services:
  node:
    container_name: reflect_bookmarks
    restart: always
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 80:5001
    volumes:
      - ./:/code
    links:
      - mongodb
    depends_on:
      - mongodb
    environment:
      WAIT_HOSTS: mongodb:27017
    networks:
      - node-webapp-network
  mongodb:
    container_name: mongodb
    # Use image: mongo:4.4.18 if you are getting AVX2 error for server that are not supporting AVX2
    image: mongo:6.0
    volumes:
      - ~/mongo:/data/db
    ports:
      - "27017:27017"
    networks:
      - node-webapp-network
volumes:
 mongodb:
networks:
  node-webapp-network:
    driver: bridge
```


# Running in Development
You can run applications on different machines / instances / domains. 


## API server 
Navigate to `./server` root directory and edit `.env`. Set `SERVER_HOST=http://localhost` as localhost. If you are running in development, your *MongoDB* database is more likely hosted on the same machine, for that reason set  `MONGO_HOST` as `localhost`.

```env
SERVER_PORT=5001
# Development server config for serving static files
SERVER_HOST=http://localhost

# Mongo Database config for production & Docker
# MONGO_HOST=mongodb

# Mongo Database config for development
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_COLLECTION=bookmarks
```

Run server in development:
```Shell
cd /server
npm start
``` 

## Client VUE3
Running client in development, by default on port 80080 - http://localhost:8080/ 
You can define setting in `vue.config.js` file and configure by your needs.
This is used only for development stage, therefore configure `target` if your Server API is hosted elsewhere.

```javascript
module.exports = {
    devServer: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/': {
                target: 'http://localhost:5001',
            },
        },
    }
}
```

Running Client in development:  
```bash
cd /client
npm run-script serve
```

## Build for production (export)
You can build your frontend and deploy to other server if required.


```bash
npm run-script build
```

