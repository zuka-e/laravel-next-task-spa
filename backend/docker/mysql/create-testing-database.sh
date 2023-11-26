#!/usr/bin/env bash

# cf. https://github.com/laravel/sail/blob/1.x/database/mysql/create-testing-database.sh
# cf. https://mariadb.com/kb/en/mariadb-11-0-1-release-notes/#docker-official-images

mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS testing;
  GRANT ALL PRIVILEGES ON \`testing%\`.* TO '$MYSQL_USER'@'%';
EOSQL
