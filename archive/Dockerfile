FROM php:7.4-apache

# Install required PHP extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install zip

# Enable Apache modules
RUN a2enmod rewrite && a2enmod headers

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/saves

# Configure Apache
COPY .htaccess /var/www/html/.htaccess
COPY apache-config.conf /etc/apache2/conf-available/custom.conf
RUN a2enconf custom

# Expose port 80
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"] 