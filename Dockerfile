# Dockerfile para el frontend (Vite + React)
FROM node:20-alpine as build

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .

RUN npm install -g pnpm && pnpm install && pnpm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
