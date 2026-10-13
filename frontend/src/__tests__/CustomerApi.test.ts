import { getCustomerJobs, getCustomerAppointments, JobData, AppointmentData } from '../services/customer-api';
import { api } from '../lib/api-client';

jest.mock('../lib/api-client', () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Customer API Data Contract & Mapping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('correctly maps JobResource response including nested service_request, tradie, and appointments', async () => {
    const mockApiResponse: { data: JobData[] } = {
      data: [
        {
          id: 101,
          request_id: 42,
          appointment_id: 12,
          service_request: {
            id: 42,
            title: 'Fix Leaking Shower',
            status: 'quote_accepted',
            postcode: '2000',
            service: { id: 1, name: 'Plumber' },
            location: { id: 10, name: 'Sydney', postcode: '2000' },
          },
          appointment: {
            id: 12,
            starts_at: '2026-10-20T09:00:00Z',
            ends_at: '2026-10-20T11:00:00Z',
            status: 'scheduled',
          },
          tradie: {
            id: 7,
            business_name: 'Apex Plumbing Solutions',
            abn: '12345678901',
            verification_status: 'verified',
          },
          status: 'scheduled',
          started_at: null,
          completed_at: null,
          created_at: '2026-10-15T08:00:00Z',
          updated_at: '2026-10-15T08:30:00Z',
        },
      ],
    };

    (api.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const jobs = await getCustomerJobs();

    expect(api.get).toHaveBeenCalledWith('/customer/jobs');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].id).toBe(101);
    expect(jobs[0].service_request?.service?.name).toBe('Plumber');
    expect(jobs[0].tradie?.business_name).toBe('Apex Plumbing Solutions');
    expect(jobs[0].appointment?.starts_at).toBe('2026-10-20T09:00:00Z');
    expect(jobs[0].status).toBe('scheduled');
  });

  it('correctly maps AppointmentResource response including starts_at, ends_at, nested job, and tradie', async () => {
    const mockApiResponse: { data: AppointmentData[] } = {
      data: [
        {
          id: 55,
          request_id: 42,
          quote_id: 8,
          service_request: {
            id: 42,
            title: 'Fix Leaking Shower',
            status: 'quote_accepted',
            postcode: '2000',
            service: { id: 1, name: 'Plumber' },
            location: { id: 10, name: 'Sydney', postcode: '2000' },
          },
          quote: {
            id: 8,
            amount: '350.00',
            description: 'Replace valve cartridge',
            status: 'accepted',
          },
          customer: {
            id: 1,
            name: 'Jane Customer',
          },
          tradie: {
            id: 7,
            business_name: 'Apex Plumbing Solutions',
            abn: '12345678901',
            verification_status: 'verified',
          },
          starts_at: '2026-10-20T09:00:00Z',
          ends_at: '2026-10-20T11:00:00Z',
          status: 'scheduled',
          notes: 'Park in visitor bay',
          job: {
            id: 101,
            status: 'scheduled',
            started_at: null,
            completed_at: null,
          },
          created_at: '2026-10-15T08:30:00Z',
          updated_at: '2026-10-15T08:30:00Z',
        },
      ],
    };

    (api.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const appointments = await getCustomerAppointments();

    expect(api.get).toHaveBeenCalledWith('/customer/appointments');
    expect(appointments).toHaveLength(1);
    expect(appointments[0].id).toBe(55);
    expect(appointments[0].starts_at).toBe('2026-10-20T09:00:00Z');
    expect(appointments[0].ends_at).toBe('2026-10-20T11:00:00Z');
    expect(appointments[0].job?.id).toBe(101);
    expect(appointments[0].tradie?.business_name).toBe('Apex Plumbing Solutions');
    expect(appointments[0].status).toBe('scheduled');
  });

  it('safely handles missing relations and nullable dates without error', async () => {
    const mockApiResponse: { data: JobData[] } = {
      data: [
        {
          id: 102,
          request_id: 43,
          appointment_id: null,
          service_request: null,
          appointment: null,
          tradie: null,
          status: 'in_progress',
          started_at: null,
          completed_at: null,
        },
      ],
    };

    (api.get as jest.Mock).mockResolvedValueOnce(mockApiResponse);

    const jobs = await getCustomerJobs();

    expect(jobs).toHaveLength(1);
    expect(jobs[0].service_request).toBeNull();
    expect(jobs[0].tradie).toBeNull();
    expect(jobs[0].started_at).toBeNull();
  });
});
