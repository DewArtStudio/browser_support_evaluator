# ОБРАЗ ОСНОВАН НА DEBIAN
FROM debian:bullseye-slim

# ОБНОВЛЕНИЕ ПАКЕТОВ
RUN apt-get update && apt-get upgrade -y

# УСТАНОВКА НЕОБХОДИМЫХ ПАКЕТОВ
RUN apt-get install curl git -y

# ИНИЦИАЛИЗАЦИЯ ДИРЕКТОРИЙ
RUN mkdir /app /loading /app/handler

# УСТАНОВКА NODE JS
RUN cd /loading && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

# КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ MDN BROWSER-COMPAT-DATA
RUN cd /app && git clone https://github.com/mdn/browser-compat-data.git

# КЛОНИРОВАНИЕ РЕПОЗИТОРИЯ MDN DATA
RUN cd /app && git clone https://github.com/mdn/data.git

# СБОРКА ГОТОВОГО ФАЙЛА ПОДДЕРЖКИ
RUN cd /app/browser-compat-data && npm install --

# РАБОЧАЯ ДИРЕКТОРИЯ
WORKDIR /app/browser-compat-data

# РЕЖИМ ЗАПУСКА
ARG RUN_MODE="development"

# КОПИРОВАНИЕ ФАЛА PACKAGE.JSON
COPY package.json /app/handler

# УСТАНОВКА ПАКЕТОВ
RUN cd /app/handler \
    && if [ "$RUN_MODE" = "production" ]; then \
        npm i --production; \
    else \
       npm i && npm i nodemon -g; \
    fi

# КОПИРОВАНИЕ ПРОЧИХ ФАЙЛОВ
COPY . /app/handler

# УСТАНОВКА РЕЖИМА РАБОТЫ NODEJS
ENV NODE_ENV=$RUN_MODE

# КОНФИГУРИРОВАНИЕ ТИПА ЗАПУСКА
RUN if [ "$RUN_MODE" = "production" ]; then \
        echo "#!/bin/sh\n npm run production" > /app/handler/run.sh; \
    else \
        echo "#!/bin/sh\n npm run development" > /app/handler/run.sh; \
    fi

# КОПИРОВАНИЕ SHELL ФАЙЛА ДЛЯ ЗАПУСКА КОНТЕЙНЕРА
COPY ./get-data.sh .

# ЗАПУСК КОНТЕЙНЕРА
CMD sh get-data.sh