FROM node:23.0.0 AS dev

WORKDIR /app

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/81b1373f17855a4dc21156cfe1694c31d7d1792e/wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

COPY package*.json .

RUN npm install

COPY . .

ENV PORT=3000
ENV NODE_ENV=development

EXPOSE ${PORT}

CMD ["wait-for-it", "postgres:5432", "--", "npm", "run", "dev"]

FROM node:23.0.0 AS prod

WORKDIR /app

COPY --from=dev /usr/bin/wait-for-it /usr/bin/wait-for-it

COPY package*.json .

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

CMD ["wait-for-it", "postgres:5432", "--", "npm", "start"]
