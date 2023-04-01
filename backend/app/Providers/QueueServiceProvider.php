<?php

namespace App\Providers;

use Illuminate\Contracts\Queue\Job;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;

/**
 * @see \Illuminate\Queue\Jobs\Job
 * @see \Illuminate\Queue\Jobs\RedisJob etc
 * @see \Illuminate\Queue\Connectors\RedisConnector etc
 */
class QueueServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        /**
         * Listen Job Events
         *
         * @see https://laravel.com/docs/queues#job-events
         * @see https://laravel.com/docs/events
         */

        /**
         * @see \Illuminate\Queue\QueueManager::before
         * @see \Illuminate\Queue\Worker::raiseBeforeJobEvent
         */
        Queue::before(function (JobProcessing $event): void {
            Log::debug(
                "{$event->job->resolveName()} processing.",
                $this->makeLogContext($event->job),
            );
        });

        /**
         * @see \Illuminate\Queue\QueueManager::after
         * @see \Illuminate\Queue\Worker::raiseAfterJobEvent
         */
        Queue::after(function (JobProcessed $event): void {
            Log::info(
                "{$event->job->resolveName()} processed.",
                $this->makeLogContext($event->job),
            );
        });

        /**
         * @see https://laravel.com/docs/queues#failed-job-events
         * @see \Illuminate\Queue\QueueManager::failing
         * @see \Illuminate\Queue\Jobs\Job::fail
         */
        Queue::failing(function (JobFailed $event): void {
            Log::error(
                "{$event->job->resolveName()} failed.",
                $this->makeLogContext($event->job),
            );
        });
    }

    /**
     * Return log context.
     *
     * @return array<string, string>
     */
    private function makeLogContext(Job $job): array
    {
        return [
            'id' => $job->getJobId(),
            'queue' => $job->getQueue(),
        ];
    }
}
