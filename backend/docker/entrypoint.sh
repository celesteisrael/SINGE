#!/bin/sh
set -e

# Adapt Nginx port to Render's $PORT if provided
if [ -n "$PORT" ]; then
    echo "Configuring Nginx to listen on port $PORT..."
    sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/http.d/default.conf
fi

# Discover Laravel packages now that environment is available
php artisan package:discover --ansi || true

# If using SQLite, ensure database file exists, has correct permissions and is seeded
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    echo "Configuring SQLite database..."
    mkdir -p /var/www/html/database
    touch /var/www/html/database/database.sqlite
    chown -R www-data:www-data /var/www/html/database
    chmod -R 775 /var/www/html/database
    php artisan migrate --force
    php artisan db:seed --force
elif [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
    if [ "$RUN_SEEDERS" = "true" ]; then
        echo "Running seeders..."
        php artisan db:seed --force
    fi
fi

# Cache configs and routes
php artisan config:cache || true
php artisan route:cache || true

echo "Starting Nginx and PHP-FPM..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
