#!/usr/bin/env bash

#==========================================================================
# Note:
#==========================================================================
#
# Running `artisan optimize` in a Dockerfile leads to vulnerabilities,
# particularly when dealing with sensitive values like `APP_KEY`.
# In addition, you may consider not using `artisan optimize`(`config:cache`),
# bacause it'll cache configs in the server which could be a problem if compromised.
#

php artisan migrate --force &&
  php artisan optimize &&
  exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.prod.conf
