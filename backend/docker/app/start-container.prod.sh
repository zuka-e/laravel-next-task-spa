#!/usr/bin/env bash

php artisan optimize &&
  exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.prod.conf

#==========================================================================
# Note:
#==========================================================================
#
# Running `php artisan optimize` in a Dockerfile leads to vulnerabilities,
# particularly when dealing with sensitive values like `APP_KEY`
#
