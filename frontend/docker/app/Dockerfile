# cf. https://docs.docker.com/develop/develop-images/dockerfile_best-practices

ARG NODE_VERSION

# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

#==========================================================================
# Base Image for each environment
#==========================================================================

# cf. https://hub.docker.com/_/node/
# cf. https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md
FROM node:${NODE_VERSION:-22} AS base

ARG CONFIG_DIR=./docker/app
ARG WORKDIR=/var/www/html
ARG USER=nextjs
ARG HOME=/home/${USER}

ENV LC_ALL=C.UTF-8

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR ${WORKDIR}

RUN useradd -m -s /bin/bash ${USER}

#==========================================================================
# For development
#==========================================================================
# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/dev.Dockerfile

FROM base AS local

RUN apt-get update && apt-get install -y \
        git \
        vim \
    && apt-get -y autoremove \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN corepack enable

# VSCode extensions for DevContainer
RUN mkdir -p ${HOME}/.vscode-server/extensions \
    && chown -R ${USER} ${HOME}/.vscode-server

# Allow `USER` to access these files.
RUN mkdir -p ./node_modules \
    && chown -R ${USER}:${USER} ./node_modules

COPY --chown=${USER}:${USER} ./package.json ./pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prefer-offline

USER ${USER}

COPY ./ ./

CMD ["pnpm", "dev"]

#==========================================================================
# For package installation
#==========================================================================

FROM base AS build

COPY ./package.json ./pnpm.lock ./

RUN pnpm install --frozen-lockfile --ignore-scripts --prefer-offline

COPY ./ ./

RUN pnpm build

#==========================================================================
# For production
#==========================================================================
# cf. https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/prod.Dockerfile

FROM build AS production

RUN mkdir -p ./.next \
    && chown -R ${USER}:${USER} ./.next

COPY --from=build --chown=${USER} ${WORKDIR}/public ./public/
COPY --from=build --chown=${USER} ${WORKDIR}/.next/ ./.next/

USER ${USER}

CMD ["pnpm", "start"]
