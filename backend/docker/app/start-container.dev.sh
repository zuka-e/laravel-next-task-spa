#!/usr/bin/env bash

#==========================================================================
# Note:
#==========================================================================
#
# Even if installing dependencies like npm at `Dockerfile`,
# with setting a volume in `docker-compose.yml`,
# the host machine will override the corresponding container content.
#
# To deal with that problem, a named volume can be used.
# (https://docs.docker.com/compose/compose-file/07-volumes)
# The specified directory (`vendor` etc) won't be overwritten.
# But the corresponding host directory is no longer synced,
# so IDE support such as code completion won't work.
# DevContainer (https://containers.dev) helps in this case.
#
# Instead, there is another approach where installing dependencies also in the host.
# Run `npm ci; composer i` in this file,
# and the dependencies will be installed when the Docker container is started.
#
# npm ci
#
# composer i
#

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.dev.conf
