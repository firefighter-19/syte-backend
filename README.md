# Make sure you have installed Docker

### If not, install it [here](https://docs.docker.com/get-docker/)

## Install postgresql for Docker using command

```bash
docker compose up --build
```

### Migrations will run automatically

## The app is ready to use on localhost:5173

## Data base diagram

![DataBase Diagram](https://github.com/firefighter-19/syte-test/blob/master/db-diagram.png?raw=true)

### All DTOs is available in backend folder


## PS (what to improve):

```I've used the wrond way of updating the is_primary 'column' for the catalog. It's better way to use primaryAt with date, then we have an 'rollback' opportinty if it needs.```
