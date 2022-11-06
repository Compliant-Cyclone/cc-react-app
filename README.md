# Docker React


## 1. Start Docker environment:
This step will download the base image and build the container.
Open a terminal in the same directory as the repo and run:
```
docker-compose up
```


## 2. Run the development environment:
Now we will work inside the container. Open a terminal to the container either 

a. from the Docker Desktop -> cc-react-app -> web-dev-1 -> Open in terminal
or
b. from another terminal run  
```
docker exec -it cc-react-app-web-dev-1 sh
```

Run yarn to install packages:

```
yarn
```

once the packages are installed run yarn start to develop


```
yarn start
```


Open browser:
http://localhost:3000/

