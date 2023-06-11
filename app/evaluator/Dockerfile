# ОБРАЗ ОСНОВАН НА DEBIAN
FROM debian:bullseye-slim

# РАБОЧАЯ ДИРЕКТОРИЯ
WORKDIR /app

# УСТАНОВКА НЕОБХОДИМЫХ ПАКЕТОВ
RUN apt-get update && apt-get upgrade -y && apt-get install curl -y

# УСТАНОВКА NODE JS
RUN mkdir /loading && cd /loading && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install nodejs -y

# АРГУМЕНТЫ СБОРКИ
ARG RUN_MODE="development"
ARG HTTP_PORT=80
ARG HTTPS_PORT=443

# УСТАНОВКА РЕЖИМА РАБОТЫ NODEJS
ENV NODE_ENV=$RUN_MODE

# КОПИРОВАНИЕ ФАЙЛА PACKAGE.JSON  
COPY "package*.json" .

# КОНФИГУРИРОВАНИЕ ТИПА ЗАПУСКА
RUN if [ "$RUN_MODE" = "production" ]; then \
        npm i --production && echo "#!/bin/sh\n npm run production" > /app/run.sh; \
    else \
        npm i && npm i nodemon -g && echo "#!/bin/sh\n npm run development" > /app/run.sh; \
    fi

# КОПИРОВАНИЕ ОСТАЛЬНЫХ ФАЙЛОВ
COPY . .

# ПРОСЛУШИВАНИЕ ПОРТОВ
EXPOSE $HTTP_PORT/tcp $HTTPS_PORT/tcp

# ЗАПУСК ПРОГРАММЫ
CMD ["sh", "/app/run.sh"]