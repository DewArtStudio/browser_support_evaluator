FROM debian:bullseye-slim

# АРГУМЕНТЫ СБОРКИ
ARG NGINX_VERSION

# РАБОЧАЯ ДИРЕКТОРИЯ
WORKDIR /root

# ОБНОВЛЕНИЕ И УСТАНОВКА OPENSSL
RUN apt-get update && apt-get upgrade -y && apt-get install openssl

# ГЕНЕРАЦИЯ КЛЮЧА ДЕФФИ-ХЕЛМАНА
RUN mkdir /secure && openssl dhparam -out /secure/dhparam.pem 1024

# ОБНОВЛЕНИЕ И УСТАНОВКА НУЖНЫХ ПАКЕТОВ
RUN apt-get update && apt-get upgrade -y && apt-get install git zlib1g-dev  make build-essential libpcre3-dev libcurl4-openssl-dev gcc libexpat1-dev wget tar -y;

# СОЗДАНИЕ ФАЙЛОВОЙ СТРУКТУРЫ ДЛЯ СКАЧИВАНИЯ И УСТАНОВКИ
RUN mkdir /src && mkdir /src/nginx && mkdir /src/nginx/modules

# СКАЧИВАНИЕ ИСХОДНИКОВ NGINX
RUN cd /src/nginx \
    && wget http://nginx.org/download/nginx-$NGINX_VERSION.tar.gz  \
    && tar -zxvf nginx-$NGINX_VERSION.tar.gz 


# КОПИРОВАНИЕ СКРИПТА КОМПИЛЯЦИИ И УСТАНОВКИ
COPY ./conf.sh /src/nginx/nginx-$NGINX_VERSION

# СБОРКА NGINX И ЕГО МОДУЛЕЙ 
RUN mkdir /www && cd /src/nginx/nginx-$NGINX_VERSION && sh conf.sh 

# КОПИРОВАНИЕ ФАЙЛА КОНФИГУРАЦИИ ДЛЯ NGINX
COPY ./nginx.conf /etc/nginx

# НАСТРОЙКА ПОЛЬЗОВАТЕЛЯ NGINX
RUN chmod -R 777 /www

# ПРОСЛУШИВАНИЕ ПОРТОВ
EXPOSE 80/tcp 443/tcp 80/udp 443/udp

STOPSIGNAL SIGTERM

USER root

CMD ["nginx", "-g", "daemon off;"]