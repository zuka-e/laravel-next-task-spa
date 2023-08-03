# cf. https://docs.docker.com/develop/develop-images/dockerfile_best-practices

# cf. https://hub.docker.com/_/composer
FROM composer:2.5.8 as composer

# cf. https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:20.3.1 as node

# cf. https://hub.docker.com/_/php
FROM php:8.2-fpm

ARG WORKDIR=/var/www/html
ARG WWWUSER=1000
ARG USERNAME=sail

ENV WORK_DIR=${WORKDIR}
ENV USERNAME=${USERNAME}

WORKDIR ${WORKDIR}

# Install Composer
COPY --from=composer /usr/bin/composer /usr/bin/composer
# Install `node`
COPY --from=node /usr/local/bin/ /usr/bin/
# Install `npm`
COPY --from=node /usr/local/lib/node_modules/npm /usr/lib/node_modules/npm

# Set system timezone (`TZ` can also be used)
RUN ln -snf /usr/share/zoneinfo/UTC /etc/localtime

RUN apt-get update && apt-get install -y \
    git \
    # Required by ext `gd`
    libpng-dev \
    libzip-dev \
    # libpq-dev \ if using ext `pdo_pgsql`
    supervisor \
    sqlite3 \
    # Only for DevContainer
    vim \
    zip unzip \
    # Core Extensions (cf. https://hub.docker.com/_/php)
    && docker-php-ext-install \
    gd \
    # Required by `laravel/horizon`
    pcntl \
    # MySQL driver
    pdo pdo_mysql \
    zip \
    # PECL extensions (cf. https://hub.docker.com/_/php)
    && pecl install \
    # cf. https://laravel.com/docs/10.x/redis
    # cf. https://github.com/phpredis/phpredis/blob/develop/INSTALL.md
    redis \
    xdebug-3.2.1 \
    && docker-php-ext-enable \
    redis \
    xdebug \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Install Composer dependencies
COPY composer.json composer.lock ./
RUN composer install --prefer-dist --no-scripts --no-autoloader --no-interaction --no-plugins

COPY . .

# Create a non root user
RUN useradd -m -s /bin/bash -u ${WWWUSER} ${USERNAME}

# Generate the autoloader file
RUN composer dump-autoload

# VSCode extension in DevContainer
RUN mkdir -p /home/${USERNAME}/.vscode-server/extensions \
    && chown -R ${USERNAME} /home/${USERNAME}/.vscode-server

COPY docker/start-container /usr/local/bin/start-container
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/99-${USERNAME}.ini

RUN chmod +x /usr/local/bin/start-container

ENTRYPOINT ["start-container"]
