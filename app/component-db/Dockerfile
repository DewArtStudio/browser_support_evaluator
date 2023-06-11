# ОБРАЗ REDIS
FROM redis:7.2-rc1-alpine
# АРГУМЕНТЫ СБОРКИ
ARG PASSWORD="password"
# ИНИЦИАЛИЗАЦИЯ ДИРЕКТОРИИ
RUN mkdir /data/bases
# КОПИРОВАНИЕ ФАЙЛА КОНФИГУРАЦИИ
COPY redis.conf /usr/local/etc/redis/redis.conf 
# УСТАНОВКА ПРАВ ДОСТУПА К ФАЙЛУ
RUN chmod 755 /usr/local/etc/redis/redis.conf
# ЗАПУСК REDIS-SERVER
CMD redis-server /usr/local/etc/redis/redis.conf --requirepass "$PASSWORD"
