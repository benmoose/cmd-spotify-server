# Server

## Installation

 1. Clone the repo

```
git clone https://github.com/benjaminhadfield/cmd-spotify-server.git
```

 2. Navigate to the repo

```
cd cmd-spotify-server
```

The next steps differ depending on whether you arre using docker or a local
version of Node to run the server. If you are running a local version of Node,
I have only tested it on the LTS version as of April 2018 (v8.x.x).

#### Docker

 3. In the project root, build the image

```
docker build -t cmd-spotify/server .
```

 4. Run the image, exposing the port to your host machine

```
docker run -p 3001:3001 cmd-spotify/server
```

If you want to use a different port on your host machine, change the `-p` flag
to `<PORT>:3001`. If you do this, then you will need to change the API URL
environment variable on the client to point to the new port.

#### Local Node

 3. In the project root, build the project

```
npm run build
```

 4. Start the development server

```
npm start
```
