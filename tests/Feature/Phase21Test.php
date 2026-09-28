<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class Phase21Test extends TestCase
{
    use RefreshDatabase;

    public function test_service_request_rate_limiting()
    {
        // Simple assertion that throttle middleware is attached
        $route = collect(\Route::getRoutes())->first(fn ($r) => $r->uri() === 'api/v1/service-requests' && in_array('POST', $r->methods()));
        $this->assertNotNull($route);
        $this->assertTrue(in_array('throttle:10,1', $route->middleware()));
    }

    public function test_chat_message_rate_limiting()
    {
        $route = collect(\Route::getRoutes())->first(fn ($r) => $r->uri() === 'api/v1/conversations/{id}/messages' && in_array('POST', $r->methods()));
        $this->assertNotNull($route);
        $this->assertTrue(in_array('throttle:30,1', $route->middleware()));
    }

    public function test_file_download_rate_limiting()
    {
        $route = collect(\Route::getRoutes())->first(fn ($r) => $r->uri() === 'api/v1/files/{type}/{id}' && in_array('GET', $r->methods()));
        $this->assertNotNull($route);
        $this->assertTrue(in_array('throttle:30,1', $route->middleware()));
    }
}
