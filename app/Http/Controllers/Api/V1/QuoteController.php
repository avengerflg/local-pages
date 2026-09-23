<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Quote\AcceptQuoteAction;
use App\Actions\Quote\CreateQuoteAction;
use App\Actions\Quote\GetCustomerQuotesAction;
use App\Actions\Quote\GetQuoteDetailAction;
use App\Actions\Quote\RejectQuoteAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Quote\CreateQuoteRequest;
use App\Http\Resources\QuoteDetailResource;
use App\Http\Resources\QuoteResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class QuoteController extends Controller
{
    /**
     * Submit a quote for a service request (tradie only).
     */
    public function store(CreateQuoteRequest $request, int $id, CreateQuoteAction $action): JsonResponse
    {
        $files = $request->file('attachments', []);
        $attachments = is_array($files) ? $files : ($files ? [$files] : []);

        $quote = $action->execute(
            $request->user(),
            $id,
            $request->validated(),
            $attachments
        );

        return (new QuoteDetailResource($quote))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * List all quotes for a customer's service request.
     */
    public function index(Request $request, int $id, GetCustomerQuotesAction $action): JsonResponse
    {
        $perPage = $request->integer('per_page', 15);
        $quotes = $action->execute($request->user(), $id, $perPage);

        return QuoteResource::collection($quotes)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Show details of a specific quote.
     */
    public function show(Request $request, int $id, GetQuoteDetailAction $action): JsonResponse
    {
        $quote = $action->execute($request->user(), $id);

        return (new QuoteDetailResource($quote))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Accept a quote (customer only).
     */
    public function accept(Request $request, int $id, AcceptQuoteAction $action): JsonResponse
    {
        $quote = $action->execute($request->user(), $id);

        return (new QuoteDetailResource($quote))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Reject a quote (customer only).
     */
    public function reject(Request $request, int $id, RejectQuoteAction $action): JsonResponse
    {
        $quote = $action->execute($request->user(), $id);

        return (new QuoteDetailResource($quote))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
