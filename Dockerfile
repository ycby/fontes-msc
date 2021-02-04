FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER root

# Uncomment these lines for running on Uni server
# RUN npm config set proxy http://wwwcache.st-andrews.ac.uk:8080
# RUN npm config set https-proxy http://wwwcache.st-andrews.ac.uk:8080
RUN npm install stylus -g
RUN npm install uglify-js -g

USER node

# Uncomment these lines for running on Uni server
# RUN npm config set proxy http://wwwcache.st-andrews.ac.uk:8080
# RUN npm config set https-proxy http://wwwcache.st-andrews.ac.uk:8080
RUN npm install

COPY --chown=node:node . .

EXPOSE 7500

CMD [ "node", "app.js" ]
