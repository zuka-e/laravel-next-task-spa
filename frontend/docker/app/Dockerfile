# cf. https://docs.docker.com/develop/develop-images/dockerfile_best-practices

ARG NODE_VERSION=20

# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

#==========================================================================
# Base Image for each environment
#==========================================================================

# cf. https://hub.docker.com/_/node/
# cf. https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:${NODE_VERSION} as base

ARG CONFIG_DIR=./docker/app
ARG WORKDIR=/var/www/html
ARG USER=nextjs
ARG HOME=/home/${USER}

ENV LC_ALL=C.UTF-8

WORKDIR ${WORKDIR}

RUN useradd -m -s /bin/bash ${USER}

#==========================================================================
# For development
#==========================================================================
# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/dev.Dockerfile

FROM base as local

RUN apt-get update && apt-get install -y \
        git \
        vim \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# VSCode extensions for DevContainer
RUN mkdir -p ${HOME}/.vscode-server/extensions \
    && chown -R ${USER} ${HOME}/.vscode-server

# Allow `USER` to access these files.
RUN mkdir -p ./node_modules \
    && chown -R ${USER}:${USER} ./node_modules

USER ${USER}

COPY ./package.json ./yarn.lock ./
RUN yarn --frozen-lockfile

CMD ["yarn", "dev"]

#==========================================================================
# For package installation
#==========================================================================

FROM base as build

COPY ./package.json ./yarn.lock ./

RUN yarn --frozen-lockfile

COPY ./ ./

RUN yarn build

#==========================================================================
# For production
#==========================================================================
# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/prod.Dockerfile

FROM build as production

RUN mkdir -p ./.next \
    && chown -R ${USER}:${USER} ./.next

COPY --from=build --chown=${USER} ${WORKDIR}/public ./public/
COPY --from=build --chown=${USER} ${WORKDIR}/.next/ ./.next/

USER ${USER}

CMD ["yarn", "start"]
