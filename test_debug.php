<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

use App\Models\TradieAvailability;
use Carbon\Carbon;
use Illuminate\Contracts\Console\Kernel;

$date = Carbon::now()->addDays(2)->setTime(10, 0, 0);
echo 'Date: '.$date->toDateString()."\n";
TradieAvailability::truncate();
TradieAvailability::create([
    'tradie_id' => 1,
    'specific_date' => $date->toDateString(),
    'is_available' => false,
]);
$overrides = TradieAvailability::where('tradie_id', 1)->where('specific_date', $date->toDateString())->get();
echo 'Overrides count: '.$overrides->count()."\n";
if ($overrides->isNotEmpty()) {
    echo "Is not empty!\n";
} else {
    echo "Is empty!\n";
}
