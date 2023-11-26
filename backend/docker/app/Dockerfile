# cf. https://docs.docker.com/develop/develop-images/dockerfile_best-practices

ARG PHP_VERSION

# cf. https://hub.docker.com/_/composer
FROM composer:2.5.8 as composer

# cf. https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:20.3.1 as node

#==========================================================================
# Base Image for each environment
#==========================================================================
# cf. https://hub.docker.com/_/php - Image Variants
FROM php:${PHP_VERSION}-fpm AS base

ARG CONFIG_DIR=./docker/app
ARG WORKDIR=/var/www/html
ARG WEB_USER=www-data
ARG USER=${WEB_USER}
ARG HOME=/home/${USER}

ENV LC_ALL=C.UTF-8
ENV WORK_DIR=${WORKDIR}
ENV USER=${USER}

WORKDIR ${WORKDIR}

# It'll be better to place `RUN apt-get ...` before `COPY`.
# > Once the cache is invalidated, all subsequent Dockerfile commands generate new images and the cache isn't used.
# > If your build contains several layers and you want to ensure the build cache is reusable, order the instructions from less frequently changed to more frequently changed where possible.
# > https://docs.docker.com/develop/develop-images/guidelines/

RUN apt-get update && apt-get install -y \
        libpng-dev \
        libzip-dev \
        supervisor \
        unzip \
        zip \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    # Core Extensions (cf. https://hub.docker.com/_/php)
    && docker-php-ext-install \
        gd \
        pdo_mysql \
        zip

# Create the home directory for an user used by web server.
# Note:
# The default home dir is `/var/www` and should be changed or a npm error will occur.
# (`npm i` => `Your cache folder contains root-owned files..`)
RUN mkdir -p ${HOME} \
    && chown ${USER}:${USER} ${HOME} \
    && usermod --home ${HOME} ${USER}

ENTRYPOINT ["start-container"]

#==========================================================================
# For development
#==========================================================================
FROM base as local

RUN apt-get update && apt-get install -y \
        git \
        vim \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    # Core Extensions (cf. https://hub.docker.com/_/php)
    && docker-php-ext-install \
        # cf. `laravel/horizon`
        pcntl \
    # PECL extensions (cf. https://hub.docker.com/_/php)
    && pecl install \
        # cf. https://laravel.com/docs/10.x/redis
        # cf. https://github.com/phpredis/phpredis/blob/develop/INSTALL.md
        redis \
        xdebug-3.2.1 \
    && docker-php-ext-enable \
        redis \
        xdebug

# cf. https://hub.docker.com/_/php - Configuration
RUN mv ${PHP_INI_DIR}/php.ini-development ${PHP_INI_DIR}/php.ini

# Install Composer.
COPY --from=composer --chown=${USER} /usr/bin/composer /usr/bin/composer
# Install `node`.
COPY --from=node --chown=${USER} /usr/local/bin/ /usr/bin/
# Install `npm`.
COPY --from=node --chown=${USER} /usr/local/lib/node_modules/npm /usr/lib/node_modules/npm

# VSCode extensions for DevContainer
RUN mkdir -p ${HOME}/.vscode-server/extensions \
    && chown -R ${USER} ${HOME}/.vscode-server

# Enabele a non-root user to access files.
RUN mkdir -p ./vendor ./node_modules \
    && chown -R ${USER}:${USER} ./

USER ${USER}

# Install Composer dependencies.
COPY ./composer.json ./composer.lock ./
# cf. https://getcomposer.org/doc/03-cli.md#install-i
RUN composer install --no-scripts --no-interaction

# Install Composer dependencies.
COPY ./package.json ./package-lock.json ./
# cf. https://docs.npmjs.com/cli/commands/npm-ci
RUN npm clean-install --ignore-scripts

COPY ${CONFIG_DIR}/php/php.ini ${CONFIG_DIR}/php/xdebug.ini ${PHP_INI_DIR}/conf.d/
COPY ${CONFIG_DIR}/start-container.dev.sh /usr/local/bin/start-container
COPY ${CONFIG_DIR}/supervisor /etc/supervisor/conf.d/

#==========================================================================
# For package installation to exclude package managers from production
#==========================================================================
FROM base as build

COPY --from=composer /usr/bin/composer /usr/bin/composer

# Install Composer dependencies.
COPY ./composer.json ./composer.lock ./
# cf. https://getcomposer.org/doc/03-cli.md#install-i
RUN composer install --no-dev --classmap-authoritative --no-scripts --no-plugins --no-interaction

# Update the autoloader (otherwise Class won't be found).
RUN mkdir -p ./bootstrap/cache/
COPY ./ ./
# cf. https://getcomposer.org/doc/03-cli.md#dump-autoload-dumpautoload
RUN composer dump-autoload --no-dev --classmap-authoritative

#==========================================================================
# For production
#==========================================================================
FROM base as production

# cf. https://hub.docker.com/_/php - Configuration
RUN mv ${PHP_INI_DIR}/php.ini-production ${PHP_INI_DIR}/php.ini

COPY ./ ./

COPY --from=build ${WORKDIR}/vendor/ ./vendor/
COPY --from=build --chown=${USER} ${WORKDIR}/bootstrap/cache/ ./bootstrap/cache/

COPY ${CONFIG_DIR}/php/php.ini ${PHP_INI_DIR}/conf.d/
COPY ${CONFIG_DIR}/start-container.prod.sh /usr/local/bin/start-container
COPY ${CONFIG_DIR}/supervisor/ /etc/supervisor/conf.d/

USER ${USER}

