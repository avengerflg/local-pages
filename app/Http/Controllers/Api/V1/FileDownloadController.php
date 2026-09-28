<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\File\DownloadFileAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileDownloadController extends Controller
{
    /**
     * Download a file securely.
     */
    public function download(Request $request, DownloadFileAction $action, string $type, int $id): StreamedResponse
    {
        return $action->execute($request->user(), $type, $id);
    }
}
