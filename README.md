# Fontes Anglo-Saxonici Database Application

Originally developed by [https://github.com/ycby](https://github.com/ycby).

Runs in [Docker](https://www.docker.com/) with [Docker
Compose](https://docs.docker.com/compose/).

## Running

1. [Install Docker](https://www.docker.com/get-started) if you don't have it
   already.
2. [Install Docker Compose](https://docs.docker.com/compose/install/) if you
   don't have it already and it isn't included with your Docker installation.
3. Navigate to project directory.
4. Copy `.env-template` to `.env` and edit so that it contains the correct DB
   username (`MONGO_USERNAME`) and password (`MONGO_PASSWORD`).
6. Run `docker-compose up`.
7. Visit http://localhost:7500 in your browser

If you want to serve the application from a subdirectory, adjust the value of
`BASE_URL` in `.env`. By default, it is set to `/` and should always start and
end with a '/' character. So, to serve the application at
http://localhost:7500/fontes, set `BASE_URL` to `/fontes/`.

See the [Docker Compose docs](https://docs.docker.com/compose/gettingstarted/)
for details on using Docker compose in detached mode using the `-d` flag.

## Build process

When the Docker image for the node application is built using `Dockerfile`, the
[Stylus](https://stylus-lang.com/) CSS preprocessor and the
[UglifyJS](https://github.com/mishoo/UglifyJS/) JavaScript minifier are
installed globally before `npm install` is run for the project istself. When
the container is run via `docker-compose up`, Stylus and UglifyJS commands are
used to generate minified CSS and JavaScript files, using the `BASE_URL`
environment variable to make sure that all urls in those files are correct.

## Acknowledgements

Lots of googling involved in getting the Docker-based build/deploy process
working, but this [DigitalOcean Community
article](https://www.digitalocean.com/community/tutorials/containerizing-a-node-js-application-for-development-with-docker-compose)
is the foundation of it.
