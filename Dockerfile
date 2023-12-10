
FROM ubuntu:22.04 as build
ENV DEBIAN_FRONTEND noninteractive
ENV OPENSSL_CONF=/etc/ssl/
RUN apt-get update -yq \
    && apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_20.x | bash \
    && apt-get install nodejs -yq

RUN apt-get install -y git -yq \
    && npm install -y typescript -g

RUN mkdir /app

FROM build as checkout_hash

WORKDIR /app/

COPY accounting-software /app/accounting-software/
COPY backend /app/backend/
COPY decision-engine /app/decision-engine/

WORKDIR /app/

FROM checkout_hash as supervisor
RUN apt-get install -y supervisor
COPY supervisord.conf /etc/supervisord.conf
RUN chmod 777 /etc/supervisord.conf

FROM supervisor as code
VOLUME /app/data

WORKDIR /app/accounting-software/
RUN npm install

WORKDIR /app/backend/
RUN npm install

WORKDIR /app/decision-engine/
RUN npm install

WORKDIR /app

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod 777 /app/docker-entrypoint.sh
EXPOSE 3000

#installing vim for editing files
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim"]

ENTRYPOINT ["/bin/bash", "-c", "/app/docker-entrypoint.sh"]

