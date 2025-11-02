<!-- Auth router -->

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

<!-- profile router -->

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

<!-- connection request router -->

- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accpeted/:requestId
- POST /request/review/rejected/:requestId

<!-- user router -->

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - gets you the profile of other users on platform

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

Status: ignore , interested, accepted, rejected
