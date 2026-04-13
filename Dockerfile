FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html styles.css app.js config.js config.template.js /usr/share/nginx/html/

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
