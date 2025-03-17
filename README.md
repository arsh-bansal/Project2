# API Routes

## Auth Routes

### Register User

- **POST** `/api/savelogin`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **cURL**:
  ```sh
  curl -X POST http://localhost:2006/api/savelogin -H "Content-Type: application/json" -d '{"username":"test_user","password":"test_password"}'
  ```

### Validate Login

- **GET** `/api/validatelogin`
- **Query params**:
  - username: string
  - password: string
- **cURL**:
  ```sh
  curl -X GET "http://localhost:2006/api/validatelogin?username=test_user&password=test_password"
  ```

### Update Password

- **POST** `/api/updatepassword`
- **Body**:
  ```json
  {
    "email": "string",
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **cURL**:
  ```sh
  curl -X POST http://localhost:2006/api/updatepassword -H "Content-Type: application/json" -d '{"email":"test_email@example.com","currentPassword":"current_password","newPassword":"new_password"}'
  ```

## Sales Routes

### Save Sales Data

- **POST** `/api/savesales`
- **Body**:
  ```json
  {
    "sales": "number",
    "customers": "number"
  }
  ```
- **cURL**:
  ```sh
  curl -X POST http://localhost:2006/api/savesales -H "Content-Type: application/json" -d '{"sales":123,"customers":456}'
  ```

## Applicant Routes

### Create Applicant

- **POST** `/api/applicant`
- **Body**: multipart/form-data
  - ppic: File
  - uid: string
  - name: string
  - mob: number
  - addr: string
  - existing: string
  - since: number
  - site_address: string
  - site_city: string
  - site_postal: number
  - site_area: number
  - site_floor: number
  - owner: string
- **cURL**:
  ```sh
  curl -X POST http://localhost:2006/api/applicant  -F "uid=12345" -F "name=John Doe" -F "mob=1234567890" -F "addr=123 Main St" -F "existing=yes" -F "since=2020" -F "site_address=456 Elm St" -F "site_city=Metropolis" -F "site_postal=12345" -F "site_area=1000" -F "site_floor=2" -F "owner=Jane Doe"
  ```

### Get All Applicants

- **GET** `/api/applicant`
- **cURL**:
  ```sh
  curl -X GET http://localhost:2006/api/applicant
  ```

### Update Applicant Status

- **PATCH** `/api/applicant`
- **Body**:
  ```json
  {
    "uid": "string",
    "status": "number"
  }
  ```
- **cURL**:
  ```sh
  curl -X PATCH http://localhost:2006/api/applicant -H "Content-Type: application/json" -d '{"uid":"12345","status":1}'
  ```
