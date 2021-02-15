# User Management
### User authentication - generate a token that will be used for further actions in the system. i.e send a request like
```POST /users/join``` returns JWT token. You need to provide it to further requests
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

Bicycle emulator sends its status every 1 minute, in case of managament application couldn't connect to a bike it assumes the bike broken and nobody can use it.

### get current bicycle status
```GET /bicycles/{bikeId}```

## Project Requirements
- Node.js
- mongodb

## Mongodb collections:
- users
- bicycles
- rides

## Data-flow diagram

![Diagram](https://cleanshot-cloud-fra.s3.eu-central-1.amazonaws.com/media/9685/59moq6MEm5I9l1BKxGHSCalRXqldzMN4D6iuiHHG.jpeg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECsaDGV1LWNlbnRyYWwtMSJIMEYCIQCV4ZljMbuwBD5GBmlIoWGzN6MMwfVwdkxlk02GpaN%2BJgIhAIypFj3avkK8pt6hvCX%2BPhGb%2Fjy4CJzkPAWoFMx5EROuKtkBCDQQABoMOTE5NTE0NDkxNjc0IgzE4mF4zVYRTo64NBkqtgFAJBuIdEEGhi%2FBXOfykJqpV4rJKoyI8aRisxMCLxe%2FLL%2FGXD7tQgbd6xM%2BXDCvTKfs9R9A7i7QEwZpeJxkeo6JscsJxal8E3UHZVIyA%2Fk2zTeNICC4n6vTS3fwqI0z8SLZSrGOUJ8B4qAVQBJr78oIB%2BwGHMa41WrCETotbJhorggSza5wJUDaHAszHpN1hDkHExhDlPr5pN41tVjduJLwIz%2FC16wePyKkJogyBSmQSJo33bZ2ijCGj6uBBjrfAaHu5mGO5%2B%2B59JSxgP%2F3UW32YTyc5kFFOOuDEM7Z8r12bACIiCCQRd5goEShI%2FjUA3X4LgE9ywhJmSr0InUMTYDpvQukuqrUb8qs1tY8f%2BRTLfJ2PTaj8RDs9e7n0lw396E0I7qfhij2Hcu8AIKvveaJls2PfCHoFWZmguK%2Bg0At1gCA4215G9DvWCf1BeyNfxhgO%2FMxPKYV1gVb5qWHalN04V%2FXHlosjAukaRSmlUuEgRdMQ2ia52kat21t1mweMH7BebyJJcDiDR9am8VdnHBnvq%2BLHBueggMxqUhaxIk%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA5MF2VVMNN5W7TTG4%2F20210215%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20210215T204826Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=1ff64e2bb4c027ccb536583882fe70bb8d9207d3c02f86707272bb9d26349b08)