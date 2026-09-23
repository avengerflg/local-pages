<?php

namespace App\Actions\Review;

use App\Models\Review;
use App\Models\ReviewResponse;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

class RespondToReviewAction
{
    /**
     * Allow the assigned tradie to post a single public response to a review.
     *
     * - tradie is derived server-side from auth()->user()->tradieProfile
     * - the review must belong to this tradie
     * - only one response per review is permitted (enforced by DB UNIQUE on review_id)
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, int $reviewId, array $data): ReviewResponse
    {
        $tradieProfile = $user->tradieProfile;

        if (! $tradieProfile) {
            abort(Response::HTTP_FORBIDDEN, 'User does not have a tradie profile.');
        }

        return DB::transaction(function () use ($tradieProfile, $reviewId, $data) {
            // Lock the review row to guard against duplicate concurrent response submissions.
            $review = Review::where('id', $reviewId)
                ->lockForUpdate()
                ->first();

            if (! $review || $review->tradie_id !== $tradieProfile->id) {
                // Return 404 so unrelated tradies cannot enumerate review IDs.
                abort(Response::HTTP_NOT_FOUND, 'Review not found.');
            }

            // Enforce single-response cardinality; the DB UNIQUE constraint on review_id
            // is the ultimate safeguard, but a clean 422 is preferable.
            $alreadyResponded = ReviewResponse::where('review_id', $reviewId)->exists();
            if ($alreadyResponded) {
                throw ValidationException::withMessages([
                    'review_id' => ['A response has already been submitted for this review.'],
                ]);
            }

            $response = ReviewResponse::create([
                'review_id' => $review->id,
                // tradie_id derived server-side; never accepted from client.
                'tradie_id' => $tradieProfile->id,
                'response_text' => $data['response_text'],
            ]);

            return $response->loadMissing(['review', 'tradieProfile']);
        });
    }
}
