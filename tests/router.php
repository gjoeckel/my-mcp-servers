<?php
// Router to simulate Apache + .htaccess behavior for PHP's built-in server
// - Maps /php/api/{name} -> /php/api/{name}.php (preserve method)
// - Maps /php/{name} -> /php/{name}.php
// - Serves static files directly
// - Routes / -> /index.php

declare(strict_types=1);

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH) ?: '/';

$docRoot = realpath(__DIR__ . '/..');
$filePath = $docRoot . $path;

// Serve existing files (static assets, actual php files) directly
if ($path !== '/' && is_file($filePath)) {
    return false; // Let built-in server handle
}

// Map root to index.php
if ($path === '/' || $path === '') {
    require $docRoot . '/index.php';
    return true;
}

// API: extensionless to .php
if (preg_match('~^/php/api/([^/.]+)$~', $path, $m)) {
    $target = $docRoot . '/php/api/' . $m[1] . '.php';
    if (is_file($target)) {
        require $target;
        return true;
    }
}

// General php: extensionless to .php
if (preg_match('~^/php/([^/.]+)$~', $path, $m)) {
    $target = $docRoot . '/php/' . $m[1] . '.php';
    if (is_file($target)) {
        require $target;
        return true;
    }
}

// Fallback 404
http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo "Not Found: {$path}\n";
return true;


