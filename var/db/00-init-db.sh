#!/bin/bash

# Allow every host to connect
cat >/var/lib/postgresql/data/pg_hba.conf <<EOL
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust

# IPv4 local connections:

########### LINE ADDED ###########
host    all             all             0.0.0.0/0               md5

host    all             all             127.0.0.1/32            trust

# IPv6 local connections:

########### LINE ADDED ###########
host    all             all             ::/0                    md5
host    all             all             ::1/128                 trust

# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust

host all all all trust
EOL

# Update PSQL port
echo "port = 15432" >> /var/lib/postgresql/data/postgresql.conf