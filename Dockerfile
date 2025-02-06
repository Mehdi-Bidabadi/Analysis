FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# FROM nginx:stable-alpine

# COPY --from=build /app/.next /usr/share/nginx/html

EXPOSE 3000

CMD ["npm", "start"]