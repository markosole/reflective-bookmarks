# Bookmar Manager + NodeJS + VUE

This is simple Bookmark Dashboard Manager, one of many out there but has something that others do not offer. 
Built as an idea to replace your Browser default page and allow you to convert it into large Bookmark dashboard.

It is based on NodeJS express server, MongoDB and VUE3 app as a frontend.

## Features

- ✅ Self Hosted & Open Source
- ✅ Runs as a Docker and as standalone NodeJS + MongoDB + VUE3 app
- ✅ Multiuser interface (profiles similar to Netflix) with simple switching
- ✅ Available on the local network and Online
- ✅ Categories with ordering
- ✅ Bookmarks ordering with drag & drop
- ✅ Bookmarks export as JSON
- ❎ Bookmark import (ToDo)

# Configuration
To run in production and on your public domain, set your FQDN.

## API server 
Navigate to `./server` root directory and edit `.env`. Replace `http://localhost` with your domain. If you are running Server and Client as stand alone applications, change host on `MONGO_HOST` or leave as default for Docker environment.

```env
SERVER_PORT=5001
# Development server config for serving static files
SERVER_HOST=http://localhost

# Mongo Database config
MONGO_HOST=mongodb
MONGO_PORT=27017
MONGO_COLLECTION=bookmarks
```

## Frontend
Navigate to `./client` directory and edit `.env.production.local`. For production, replace localhost with your FQDN domain. Edit `VUE_APP_SERVER_PORT` server port as required. By default Docker will serve API and frontend on port 80 and you can modify this if you wish to server Sever and Client on different ports. This will be used to communicate with API server.

```env
VUE_APP_SERVER_PORT=
VUE_APP_SERVER_HOST=http://localhost

VUE_APP_FRONTEND_PORT=8081
VUE_APP_FRONTEND_HOST=http://localhost
```

# Runs in Docker
Application will be hosted on port 80 by default. Modify Docker Compose file if you need different external port `80:5001`. API will run internally on port 5001 by default.

```bash
docker-compose up -d --build
```

# Running individually
You can run applications on different machines / instances / domains. 

Running server, acting as Endpoint:
```bash
cd /server
npm start
```


Running client in development, by default on port 80080 - http://localhost:8080/ 
```bash
cd /client
npm run-script serve
```

Build for production:
```bash
npm run-script build
```

### MongoDB
Requires MongoDB 5+, with no authentication added. When deploying to production make sure to secure your Mongo instance.