FROM node:14.18.2-alpine AS build-stage
WORKDIR /app
COPY /client ./client
WORKDIR /app/client
RUN npm install -g @vue/cli && npm install
RUN npm run-script build

# Production stage
FROM node:14.18.2-alpine AS production-stage
COPY /server /app/server
WORKDIR /app/server
RUN npm install
COPY --from=build-stage /app/client/dist/ /app/server/public
CMD ["npm", "start"]