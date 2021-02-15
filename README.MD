- User authentication - generate a token that will be used for further actions in the system. i.e send a request like
  /users/join and you’ll get a token. POST /users/join returns JWT token. You need to provide it to next requests
- Add funds to a user, like users/funds ( post add amount). POST /users/funds {
  "token": "jwtToken,
  "funds": 50 }
- get bicycles list (bicycle id, status, other params ... )
  GET /bicycles

- rent a bicycle by ID ( renting will cost 5$ per hour, only for bicycles that are not currently rent and not broken)
  POST /bicycles/{bikeId}/rent

- return a bicycle (end ride for the user, then calculate ride cost)
  POST /bicycles/{bikeId}/rent-end
  
- turn light on all bicycles
  POST /bicycles/turn-light
    