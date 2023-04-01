<?php

/**
 * @see \Illuminate\Queue\Connectors\ConnectorInterface
 */
return [
    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection Name
    |--------------------------------------------------------------------------
    |
    | Laravel's queue API supports an assortment of back-ends via a single
    | API, giving you convenient access to each back-end using the same
    | syntax for every one. Here you may define a default connection.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'sync'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    |
    | Here you may configure the connection information for each server that
    | is used by your application. A default configuration has been added
    | for each back-end shipped with Laravel. You are free to add more.
    |
    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis", "null"
    |
    */

    'connections' => [
        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => 'localhost',
            'queue' => 'default',
            'retry_after' => 90,
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env(
                'SQS_PREFIX',
                'https://sqs.us-east-1.amazonaws.com/your-account-id',
            ),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        // cf. https://laravel.com/docs/10.x/queues#redis
        /** @see \Illuminate\Queue\Connectors\RedisConnector */
        'redis' => [
            'driver' => 'redis',
            'connection' => 'default',
            // > Some applications may not need to ever push jobs onto multiple queues.
            // > However useful to prioritize or segment how jobs are processed.
            // > https://laravel.com/docs/10.x/queues#connections-vs-queues
            // cf. https://laravel.com/docs/10.x/queues#queue-priorities
            // ※ same as `--queue={REDIS_QUEUE}`
            'queue' => env('REDIS_QUEUE', 'default'),
            // > The `--timeout` value should always be at least several seconds shorter
            // > than your `retry_after` configuration value.
            // > https://laravel.com/docs/10.x/queues#worker-timeouts
            // cf. https://laravel.com/docs/10.x/queues#job-expiration
            'retry_after' => 90,
            // cf. https://laravel.com/docs/10.x/queues#redis
            // cf. https://laravel.com/docs/10.x/queues#processing-all-queued-jobs-then-exiting
            'block_for' => null,
            'after_commit' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    |
    | These options configure the behavior of failed queue job logging so you
    | can control which database and table are used to store the jobs that
    | have failed. You may change them to any database / table you wish.
    |
    */

    // cf. https://laravel.com/docs/10.x/queues#storing-failed-jobs-in-dynamodb
    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],
];
