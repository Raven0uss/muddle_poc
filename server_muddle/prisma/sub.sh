[ -z "${PRISMA_PORT}" ] && echo "Not set: PORT";
[ -z "${PRISMA_DB_URI}" ] && echo "Not set: PRISMA_DB_URI";

cp config.yml prisma.yml
sed -ri 's/port: PORT/port: '$PRISMA_PORT'/g' prisma.yml
sed -ri 's/uri: PRISMA_DB_URI/uri: '$PRISMA_DB_URI'/g' prisma.yml