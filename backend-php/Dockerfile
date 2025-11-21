FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# ====================================================================
# DEVELOPMENT SETUP: No COPY here!
# Code is mounted via volume in compose.yaml (.:/var/www)
# This allows real-time code updates without rebuilding! 🚀
# ====================================================================

# Note: composer install will run from mounted code via volume
# Dependencies will be installed when container starts

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]