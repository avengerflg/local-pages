# Installation

## Requirements
- PHP 8.3+
- Composer
- Node.js and npm/pnpm
- MySQL or PostgreSQL
- Git
- Redis is recommended when queue/realtime functionality is enabled

## Initial setup

```bash
git clone <repository-url>
cd local-pages-tredies

composer install

cp .env.example .env

php artisan key:generate
```

## Configure database
Update `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=local_pages_tredies
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Use PostgreSQL values if PostgreSQL is selected.

## Run migrations

```bash
php artisan migrate
```

Only run seeders when they exist and are documented.

## Frontend

```bash
npm install
npm run dev
```

## Laravel development server

```bash
php artisan serve
```

## Queue

When queues are enabled:

```bash
php artisan queue:work
```

## Tests

```bash
php artisan test
```

## Formatting

If Laravel Pint is configured:

```bash
./vendor/bin/pint
```

## Environment safety
Never commit `.env`.

Production:
- `APP_ENV=production`
- `APP_DEBUG=false`
- Use production secrets through secure environment/secret management.
- Use HTTPS.
- Configure private file storage.
- Configure queue workers and monitoring.

## First setup verification
Verify:
1. Laravel boots.
2. Database connection works.
3. Migrations succeed.
4. Health endpoint responds.
5. Test suite passes.
6. Frontend development server starts.
