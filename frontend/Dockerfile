FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install tailwindcss @tailwindcss/postcss
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]