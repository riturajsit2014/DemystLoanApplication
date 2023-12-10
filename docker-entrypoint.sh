#!/bin/bash

echo "Running supervisor"
exec /usr/bin/supervisord -c /etc/supervisord.conf --nodaemon
