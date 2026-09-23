<?php

namespace App\Actions\Admin\Dashboard;

use App\Models\Appointment;
use App\Models\Job;
use App\Models\Quote;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceRequest;
use App\Models\TradieProfile;
use App\Models\User;

class GetAdminDashboardAction
{
    /**
     * Retrieve aggregated platform operational statistics for administrative dashboard.
     *
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        return [
            'users' => [
                'total' => User::count(),
                'customers' => User::where('role', 'customer')->count(),
                'tradies' => User::where('role', 'tradie')->count(),
                'admins' => User::where('role', 'admin')->count(),
                'active' => User::where('status', 'active')->count(),
                'suspended' => User::where('status', 'suspended')->count(),
                'pending' => User::where('status', 'pending')->count(),
            ],
            'tradies' => [
                'total' => TradieProfile::count(),
                'verified' => TradieProfile::where('verification_status', 'verified')->count(),
                'pending' => TradieProfile::where('verification_status', 'pending')->count(),
                'under_review' => TradieProfile::where('verification_status', 'under_review')->count(),
                'rejected' => TradieProfile::where('verification_status', 'rejected')->count(),
            ],
            'service_requests' => [
                'total' => ServiceRequest::count(),
                'draft' => ServiceRequest::where('status', 'draft')->count(),
                'submitted' => ServiceRequest::where('status', 'submitted')->count(),
                'matching' => ServiceRequest::where('status', 'matching')->count(),
                'quoting' => ServiceRequest::where('status', 'quoting')->count(),
                'quote_accepted' => ServiceRequest::where('status', 'quote_accepted')->count(),
                'scheduled' => ServiceRequest::where('status', 'scheduled')->count(),
                'in_progress' => ServiceRequest::where('status', 'in_progress')->count(),
                'completed' => ServiceRequest::where('status', 'completed')->count(),
                'cancelled' => ServiceRequest::where('status', 'cancelled')->count(),
            ],
            'quotes' => [
                'total' => Quote::count(),
                'pending' => Quote::where('status', 'pending')->count(),
                'accepted' => Quote::where('status', 'accepted')->count(),
                'rejected' => Quote::where('status', 'rejected')->count(),
            ],
            'appointments' => [
                'total' => Appointment::count(),
                'scheduled' => Appointment::where('status', 'scheduled')->count(),
                'completed' => Appointment::where('status', 'completed')->count(),
            ],
            'jobs' => [
                'total' => Job::count(),
                'scheduled' => Job::where('status', 'scheduled')->count(),
                'in_progress' => Job::where('status', 'in_progress')->count(),
                'completed' => Job::where('status', 'completed')->count(),
            ],
            'reviews' => [
                'total' => Review::count(),
                'pending' => Review::where('moderation_status', 'pending')->count(),
                'approved' => Review::where('moderation_status', 'approved')->count(),
                'rejected' => Review::where('moderation_status', 'rejected')->count(),
            ],
            'services' => [
                'total' => Service::count(),
                'active' => Service::where('status', 'active')->count(),
                'inactive' => Service::where('status', 'inactive')->count(),
            ],
        ];
    }
}
