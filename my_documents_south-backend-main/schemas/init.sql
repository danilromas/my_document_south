-- создание пользователя
CREATE ROLE mds_user WITH LOGIN PASSWORD 'zxcvbn';

-- создание базы
CREATE DATABASE mds
    WITH
    OWNER = mds_user
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = 100
    IS_TEMPLATE = False;
GRANT ALL PRIVILEGES ON DATABASE mds TO mds_user; -- выдача прав бд -> пользователю 

-- подключение к базе
\c mds