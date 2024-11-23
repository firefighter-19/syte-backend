## Make sure you have installed Docker

# If not, install it [here](https://docs.docker.com/get-docker/)

# Install postgresql for Docker using command

```bash
docker pull postgres
```

```bash
docker run --name syteDB -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=testDB -p 5432:5432 -d postgres
```

## Build project in development mode using Docker

```bash
docker build -t syte-backend --target development .
```

## Build project in production mode using Docker

```bash
docker build -t nestjs-prod --target production .
```

# Run postgresql container

```bash
docker run -p 3000:3000  -v $(pwd):/app syte-backend
```

# Run container

```bash
docker run -p 3000:3000  -v $(pwd):/app syte-backend
```
