# Muddle - Node.js Server with - GraphQL Prisma Nexus 

## Run the server in development mode

- Run `npm run dev`

## Use Prisma and Nexus

Prisma is executed inside a container. You just have to type the schema in the datamodel and generate a CRUD for our data. Normaly, this CRUD can't be used by our server, we have to call the functions from prisma's context, but thanks to Nexus we exposed directly all the wanted CRUD functions to API routes.

### Run prisma
- From `server_muddle/` `cd prisma && docker-compose up`

#### Notes : 
- To launch the container in daemon mode, use `docker-compose up -d`.
- To check the alives containers use `docker ps`
- To stop an alive container execute `docker stop {CONTAINER}`
- To kill a stopped container `docker container prune`. You will erase completely the container.

### Deploy prisma and generate CRUD:
- From prisma folder : `prisma deploy`