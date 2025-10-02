<?php
/**
 * Minimal Chrome MCP health verification stub.
 * In a real setup, this would use MCP tools to navigate and evaluate.
 * Here we simulate by curling the health endpoint and asserting status.
 */

$baseUrl = 'http://localhost:8000';
$healthUrl = $baseUrl . '/php/api/health.php';

$body = @file_get_contents($healthUrl);
if ($body === false) {
    fwrite(STDERR, "Failed to reach health endpoint: $healthUrl\n");
    exit(1);
}

$json = json_decode($body, true);
if (!is_array($json) || !isset($json['status']) || $json['status'] !== 'ok') {
    fwrite(STDERR, "Health check did not return status ok\n");
    exit(1);
}

echo "MCP health stub passed (curl-based).\n";
exit(0);
?>


