export PRISMA_MANAGEMENT_API_SECRET=test
export PRISMA_DB_URI="mongodb+srv://root:LxNu5wTni1a2VpLM@muddlecluster.oihyt.mongodb.net/db_muddle?retryWrites=true\&w=majority"
export PRISMA_DATABASE=db_muddle
export PRISMA_PORT=4466

[ -z "${PRISMA_PORT}" ] && echo "Not set: PORT";
[ -z "${PRISMA_DB_URI}" ] && echo "Not set: PRISMA_DB_URI";


cp config.yml prisma.yml
sed -ri 's/port: PRISMA_PORT/port: '$PRISMA_PORT'/g' prisma.yml
sed -ri 's~uri: PRISMA_DB_URI~uri: '$PRISMA_DB_URI'~g' prisma.yml
echo 'start file'
cat prisma.yml
echo 'end file'