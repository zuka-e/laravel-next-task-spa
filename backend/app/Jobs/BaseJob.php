<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

/**
 * Base Job class
 *
 * With `ShouldBeUnique` interface, "unique" jobs won't be dispatched until the previous completed.
 * (Whether the job is "unique" is defined by `uniqueId()` etc.)
 *
 * cf. https://laravel.com/docs/10.x/queues#unique-jobs
 *
 * Whereas `ShouldBeUniqueUntilProcessing` is until the process begins.
 *
 * cf. https://laravel.com/docs/10.x/queues#keeping-jobs-unique-until-processing-begins
 *
 * `Bus:chain()` is used for jobs that should be run in sequence.
 *
 * cf. https://laravel.com/docs/queues#job-chaining
 *
 * `Bus::batch()` execute a batch of (the same) jobs
 *
 * cf. https://laravel.com/docs/queues#job-batching
 *
 * ※ Properties such as `$timeout` will take precedence over the specified on the command line.
 *
 * @see \Illuminate\Queue\WorkerOptions
 * @see \Illuminate\Queue\Queue::createObjectPayload
 */
abstract class BaseJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     *
     * By default, the timeout value is 60 seconds.
     * This will take precedence over any timeout specified on the command line
     *
     * @see https://laravel.com/docs/10.x/queues#timeout
     */
    public int $timeout = 30;

    /**
     * Indicate if the job should be marked as failed or retried on timeout.
     *
     * @see https://laravel.com/docs/10.x/queues#failing-on-timeout
     */
    public bool $failOnTimeout = false;

    /**
     * The number of times the job may be attempted.
     *
     * @see https://laravel.com/docs/10.x/queues#max-attempts
     */
    public int $tries = 3;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @see https://laravel.com/docs/10.x/queues#max-attempts
     */
    public int $maxExceptions = 1;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * Not respected in case of timeout. (cf. `retry_after` in `config/queue.php`)
     *
     * @see https://laravel.com/docs/10.x/queues#dealing-with-failed-jobs
     */
    public int $backoff = 90;

    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @see https://laravel.com/docs/10.x/queues#unique-jobs
     */
    public int $uniqueFor = 60 * 60 * 1;

    /**
     * Create a new Job instance.
     */
    public function __construct()
    {
        // The time from being added into the queue to being executed.
        // cf. https://laravel.com/docs/10.x/queues#delayed-dispatching
        $this->delay(3);
    }

    /**
     * Get the middleware the job should pass through.
     *
     * @return array<int, object>
     * @see https://laravel.com/docs/10.x/queues#job-middleware
     */
    public function middleware(): array
    {
        return [];

        // Usage of `WithoutOverlapping('key')`
        //
        // cf. https://laravel.com/docs/10.x/queues#preventing-job-overlaps
        //     https://laravel.com/docs/10.x/queues#unique-job-locks
        //
        // vs `ShouldBeUnique` interface:
        // `WithoutOverlapping` allows multiple instances of the same job to be queued,
        // but it prevents concurrent execution of the same job.
        // => Allow dispatch (the same job in the queue) but not execution (marked as `failed`).
        //   (`failed`: `\Illuminate\Queue\Worker::maxAttemptsExceededException`)
        // Whereas, `ShouldBeUnique` ensures that only one job is queued at any given time,
        // and it prevents queuing new instances of the same job until the previous completes.
        // => Disallow dispatching itself.
        //
        // Methods:
        // - `releaseAfter(1)` releases the jobs back to the queue and executes again after 1s.
        // - `dontRelease()` deletes the jobs (No retry, Not as `failed`)
        // - `expireAfter(1)` releases the lock after 1s.
        //
        // Note:
        // Without `expireAfter()` and if a job fails in a way that the lock is not released,
        // consecutive jobs with the same lock key will always fail.
        // ※ This will happen for example when timeout occurs.
        // In this case, manually releasing the lock may be required.
        // Although this "lock feature uses cache, (https://laravel.com/docs/10.x/cache#atomic-locks),
        // neither `\Cache::flush` or `artisan cache:clear` have no effect.
        // Furthermore, `artisan queue:clear` and `artisan horizon:clear` doesn't work.
        // Instead, run the following to release the lock.
        // ```
        // \Cache::lock((new WithoutOverlapping('key'))->getLockKey($this))->forceRelease();
        // ```
        // or `Facades\Redis::flushAll()` can also be used to remove all.
        // => `__\Illuminate\Redis\Connections\Connection::call`
        // => `\Illuminate\Redis\Connections\Connection::command`
        // => `\Redis::flushAll` will be executed.
        // ※ To see all the key in Redis, run `Redis::keys('*')`
        //
    }

    /**
     * The unique ID of the job.
     *
     * > you should ensure that all of your servers are communicating with the same central cache server
     * > https://laravel.com/docs/10.x/queues#unique-jobs
     */
    public function uniqueId(): string
    {
        // If the return value is random, it'll always unique.
        return static::class;
    }

    /**
     * Calculate the number of seconds to wait before retrying the job.
     *
     * > If you require more complex logic for determining the job's backoff time
     * > https://laravel.com/docs/10.x/queues#dealing-with-failed-jobs
     */
    public function backoff()
    {
        return $this->backoff;
    }

    /**
     * Handle a job failure.
     *
     * @see https://laravel.com/docs/10.x/queues#cleaning-up-after-failed-jobs
     */
    public function failed(\Throwable $e): void
    {
        $this->releaseLock();
    }

    /**
     * Release the `WithoutOverlapping` lock if it's used.
     */
    protected function releaseLock(): void
    {
        // `WithoutOverlapping` lock won't be released at least in case of timeout.
        // But it shouldn't be a problem for a failed job to release the lock,
        // so force release the lock in handling a failure.

        /** @var ?\Illuminate\Queue\Middleware\WithoutOverlapping */
        $withoutOverlapping = collect($this->middleware())->firstWhere(
            fn($middleware): bool => $middleware instanceof WithoutOverlapping,
        );

        if ($withoutOverlapping) {
            Cache::lock($withoutOverlapping->getLockKey($this))->forceRelease();
        }
    }
}
