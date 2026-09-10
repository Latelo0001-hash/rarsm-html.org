<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');

require_once dirname(__DIR__) . '/includes/activities.php';

date_default_timezone_set('Africa/Kinshasa');

$requestedDate = isset($_GET['date']) ? trim((string) $_GET['date']) : '';
$date = $requestedDate !== '' ? $requestedDate : date('Y-m-d');
$dateObject = DateTimeImmutable::createFromFormat('!Y-m-d', $date);

if (!$dateObject instanceof DateTimeImmutable || $dateObject->format('Y-m-d') !== $date) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_date'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$matches = [];

foreach (rarsm_activity_records() as $activity) {
    $calendarDates = $activity['calendar_dates'] ?? [$activity['date'] ?? ''];
    if (!in_array($date, $calendarDates, true)) {
        continue;
    }

    if (($activity['verification_status'] ?? '') !== 'confirmed') {
        continue;
    }

    $id = (string) ($activity['id'] ?? '');
    $matches[] = [
        'id' => $id,
        'title' => (string) ($activity['title'] ?? ''),
        'date' => $date,
        'date_label' => rarsm_activity_display_date($activity),
        'time' => (string) ($activity['time'] ?? ''),
        'location' => (string) ($activity['location'] ?? ''),
        'summary' => (string) ($activity['summary'] ?? ''),
        'image' => (string) ($activity['image'] ?? ''),
        'image_alt' => (string) ($activity['image_alt'] ?? ($activity['title'] ?? 'Activité minière')),
        'details_url' => 'activites-details.php?event=' . rawurlencode($id),
    ];
}

echo json_encode([
    'ok' => true,
    'date' => $date,
    'activity' => $matches[0] ?? null,
    'activity_count' => count($matches),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
