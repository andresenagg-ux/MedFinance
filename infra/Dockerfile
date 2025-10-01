FROM node:18-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./backend/
COPY frontend-web/package.json frontend-web/package-lock.json* ./frontend-web/
COPY frontend-mobile/package.json frontend-mobile/package-lock.json* ./frontend-mobile/
RUN cd backend && npm install
RUN cd frontend-web && npm install
RUN cd frontend-mobile && npm install
COPY . .
CMD ["npm", "start", "--prefix", "backend"]
