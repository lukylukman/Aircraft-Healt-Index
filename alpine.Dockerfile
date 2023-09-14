# FROM alpine
FROM node:16.16.0-alpine as node
WORKDIR /app
COPY . .
# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install dependencies using Yarn
RUN yarn install

# Build the Angular app
RUN ng build

FROM nginx:stable-alpine3.17
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/nex-fe /usr/share/nginx/html