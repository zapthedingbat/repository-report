# GitHub Tech Report
Basic technology reporting for github organisations

Once installed for a github user or organisation, the tools collects and reports
on the dependencies for each repository.

## Installation
```
$ npm install
```

## Usage
To communicate with github the service needs to sign requests using the AppID
and private key that was generated when the application is registered with
github.
- Set the `GITHUB_APPID` environment variable
- Save the private key file as `/.keys/github-private-key.pem`

### Running locally
#### Config
Create a `.env` file with the following format `GITHUB_APPID=xxxx` (where `xxxx`
is your registered app id)

#### Run
```
$ npm start
```
### Running in Docker

#### Build the docker image
```
$ docker build -t github-tech-report:latest .
```

#### Run the image
Mount the public key file under `/home/app/.keys`
```
$ docker run github-tech-report
```

## Contributing
Pull requests are very welcome from anyone.
