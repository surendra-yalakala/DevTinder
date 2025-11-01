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
- GET /user/requess
- GET /user/feed - gets you the profile of other users on platform

Status: ignore , interested, accepted, rejected
