# User Management
### User authentication - generate a token that will be used for further actions in the system. i.e send a request like
  /users/join and you’ll get a token.
  ```POST /users/join``` returns JWT token. You need to provide it to next requests
### Add funds to a user, like users/funds ( post add amount). 
```POST /users/funds``` Body: `{
  "token": "jwtToken,
  "funds": 50 }`
# Bicycle use
### get bicycles list (bicycle id, status, other params ... )
  ```GET /bicycles```

### rent a bicycle by ID ( renting will cost 5$ per hour, only for bicycles that are not currently rent and not broken)
  ```POST /bicycles/{bikeId}/rent```

### return a bicycle (end ride for the user, then calculate ride cost)
  ```POST /bicycles/{bikeId}/rent-end```
### report a broken bicycle (i.e bicycles/55/broken)
  ```POST /bicycles/{bikeId}/broken```
  
### turn light on all bicycles
  ```POST /bicycles/turn-light```
    
# add bicycle/bicycle emulator
```node bike.js objectBikeId PORT```
A bicycle will automatically be added to database

## Project Requirements
- Node.js
- mongodb

## Mongodb collections:
- users
- bicycles
- rides
