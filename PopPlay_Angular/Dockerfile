FROM node:22-alpine3.20 AS build
WORKDIR /build

COPY package.json .yarnrc.yml ./
RUN yarn set version berry
RUN yarn cache clean && yarn install

ENV PATH /app/node_modules/.bin:$PATH
COPY . .
RUN yarn run build --configuration production
#RUN npm i
#COPY src src
#COPY public public
#
#RUN npm run build

FROM nginx:alpine3.20 AS prod

COPY --from=build /build/dist/popplay/browser /usr/share/nginx/html

EXPOSE 80