# CaaS Proxy
This is a simple proxy written in node.js that adds an authorization header to any request sent to the target.
In this case the CaaS.
## Get started
You need node.js and npm installed.
1. clone this repository
2. run npm install
3. run the following command
```node main.js```
4. adapt the config.json to your needs (see below for recommendation)
5. enjoy

Basically you can now send requests to the CaaS without adding the apikey to the header.
The proxy does that for you.
This allows you to request images from CaaS by adding '/binary' to the end of the image URL returned.

This is the recommended ```config.json``` for running the proxy locally with a local CaaS on Node.js
```
{
	"caashost":"localhost",
	"caasport": 8080,
	"apikey":"{{your apikey}}",
	"port": 8081
}
```

## Using caas-proxy with docker
It is also possible to use caas-proxy with docker by building an image and then adding it to the ```docker-compose.yml``` of the caas.
### Building the Docker image
The Dockerfile lists instructions from which docker can build an image.
The alpine-node Docker image is used as the base image because it requires less space than the standard Node.js image.
Since this app is a Node.js app we need our image to contain the node binary executable in order to be able to run the app.
Execute following command in the caas-proxy folder to build the image.
```
$ docker build -t caas-proxy .
```
### Adding the image to the caas Docker-compose stack
In order to use the docker-image you need to add the ip-address of the **caas-gateway** to the "caashost" entry of the ```config.json```
*(for some reason the caas-proxy cannot reach the CaaS at localhost)*

For example:
```
{
	"caashost":"172.18.200.5",
	"caasport": 8080,
	"apikey":"{{your apikey}}",
	"port": 8081
}
```
You can find the ip-address by starting the caas and going to http://localhost:8088 in your browser.
Also, you need to copy the ```config.json``` to your ```caas/Configuration folder``` (*caas* being the folder where your local CaaS is installed).
Then add the following **service** to the ```docker-compose.yml``` of the CaaS by appending the following lines to the file.

```
caas-proxy:
    links:
        - caas-gateway
        - caas-rest-api
    volumes:
        - ./Configuration:/app/config
    ports:
        - "8081:8081"
    image: caas-proxy
```
If you then start the CaaS with ```docker-compose up``` the caas-proxy should be reachable via port 8081.

## Disclaimer
This proxy does not distinguish between requests and forwards all of them while adding the apikey to the header.
This poses a potential security threat because it bypasses the apikey restriction completely.
Use at your own risk.