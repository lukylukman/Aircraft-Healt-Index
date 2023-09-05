# FROM alpine
FROM node:16.16.0-alpine as node
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

FROM nginx:stable-alpine3.17
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/ahi-angular /usr/share/nginx/html