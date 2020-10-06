FROM node:12.18-alpine3.11 as build

ENV USER node
ENV GROUP node
ENV HOME /home/${USER}
ENV NPM_PACKAGES=${HOME}/npm-packages

ADD . /app/
WORKDIR /app

RUN set -eux; \
  apk update; \
  apk add --no-cache \
  py2-pip \
  bash \
  openssl \
  libc6-compat \
  gcompat \
  libgcc \
  libstdc++6 \
  libstdc++ \
  build-base \
  libtool \
  autoconf \
  automake \
  libexecinfo-dev \
  git \
  python; \
  rm -rf /var/cache/apk/* ; \
  npm ci && npm run build ; \
  npm cache verify

FROM node:12.18-alpine3.11 as base
ARG STORAGE_KEY
ENV NODE_ENV='production'
ENV USER node
ENV GROUP node
ENV HOME /home/${USER}
ENV NPM_PACKAGES=${HOME}/npm-packages
WORKDIR /app

RUN set -eux ; \
  apk add --no-cache \
  py2-pip \
  openssl \
  python; \
  rm -rf /var/cache/apk/* ; \
  mkdir -p /app /drone ;\
  chown -R "$USER":"$GROUP" /app /drone "$HOME" ; \
  pip install PyPDF2

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/node_modules/node-gyp/test/fixtures/ca-bundle.crt /etc/ssl/certs/ca-bundle.crt
# COPY --from=digitalpatterns/node:4 /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem /etc/ssl/certs/ca-bundle.crt


USER 1000
EXPOSE 8080
ENTRYPOINT exec node dist/server.js
