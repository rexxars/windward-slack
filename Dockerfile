FROM node:6-alpine
MAINTAINER Espen Hovlandsdal <espen@hovlandsdal.com>

# Set up environment
WORKDIR /srv/wwslack
ENV NODE_ENV=production

# Install app dependencies (pre-source copy in order to cache dependencies)
COPY package.json .
RUN npm install --production --silent

# Copy source files
COPY . .

# Run application
USER node
CMD ["node", "/srv/wwslack/ww-slack.js"]
