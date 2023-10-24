#!/bin/sh

# Create entries in /etc/hosts for service names and IP addresses
echo "0.0.0.0 api" >> /etc/hosts
# Add more entries for other services if needed

# Start the original command (entry point or CMD) of the Docker container
exec "$@"
