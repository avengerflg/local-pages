<?php

namespace App\Http\Controllers\Api\V1\Tradie;

use App\Actions\Tradie\DeleteTradieDocumentAction;
use App\Actions\Tradie\GetTradieDocumentsAction;
use App\Actions\Tradie\UploadTradieDocumentAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tradie\UploadTradieDocumentRequest;
use App\Http\Resources\Tradie\TradieDocumentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class TradieDocumentController extends Controller
{
    /**
     * List all documents uploaded by the authenticated tradie.
     */
    public function index(Request $request, GetTradieDocumentsAction $action): AnonymousResourceCollection
    {
        $documents = $action->execute($request->user());

        return TradieDocumentResource::collection($documents);
    }

    /**
     * Upload a new verification document.
     */
    public function store(UploadTradieDocumentRequest $request, UploadTradieDocumentAction $action): JsonResponse
    {
        $document = $action->execute(
            $request->user(),
            $request->validated('document_type'),
            $request->file('file')
        );

        return (new TradieDocumentResource($document))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Delete an unapproved verification document.
     */
    public function destroy(Request $request, int $id, DeleteTradieDocumentAction $action): JsonResponse
    {
        $action->execute($request->user(), $id);

        return response()->json([
            'message' => 'Document deleted successfully.',
        ], Response::HTTP_OK);
    }
}
