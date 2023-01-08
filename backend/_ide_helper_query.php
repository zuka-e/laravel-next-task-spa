<?php

/**
 * Some classes such as `\Illuminate\Database\Eloquent\Builder` use `@mixin`,
 * @see \Illuminate\Database\Eloquent\Builder
 * @see \Illuminate\Contracts\Database\Eloquent\Builder
 * but IntelliSense using `@mixin` annotation doesn't work so far,
 * (The extension, PHP Intelephense, seems to support only in premium.
 * cf. https://intelephense.com/)
 * and IDE Helper doesn't generate a file to solve it.
 * That's why this file was created.
 */

namespace Illuminate\Database\Query {
    /**
     * @method \Illuminate\Pagination\LengthAwarePaginator paginate()
     */
    class Builder
    {
    }
}

namespace Illuminate\Database\Eloquent {
    class Builder extends \Illuminate\Database\Query\Builder
    {
    }
}

namespace Illuminate\Database\Eloquent\Relations {
    /**
     * @method \Illuminate\Database\Eloquent\Builder getQuery()
     */
    class Relation extends \Illuminate\Database\Eloquent\Builder
    {
    }
}
