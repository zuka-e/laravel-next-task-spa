<?php

if (!function_exists('retrieveOrigin')) {
    /**
     * Retrieve the origin from the given URL.
     */
    function retrieveOrigin(string $url): string
    {
        $parsedUrl = parse_url($url);

        return ($parsedUrl['scheme'] ?? '') .
            '://' .
            ($parsedUrl['host'] ?? '') .
            ':' .
            ($parsedUrl['port'] ?? '');
    }
}

if (!function_exists('isSameOrigin')) {
    /**
     * Determine if the given URLs are from the same origin.
     */
    function isSameOrigin(string $url1, string $url2): bool
    {
        $origin1 = retrieveOrigin($url1);
        $origin2 = retrieveOrigin($url2);

        return $origin1 === $origin2;
    }
}
