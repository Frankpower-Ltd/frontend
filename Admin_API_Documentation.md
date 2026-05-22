API Documentation - Admin Endpoints
Overview
This document provides comprehensive documentation for the admin-only endpoints of the Learning Management System API. These endpoints require administrative privileges and are used for managing applications, users, courses, programs, assignments, payments, and certificates.

Base URL: https://frankpower.kingscode.dev/api/v1

Authentication: All endpoints require authentication with appropriate admin role permissions. Unauthorized requests will receive a 401 Unauthorized response.

Table of Contents
Applications

Users

Courses

Course Modules & Outlines

Schedules

Assignments & Submissions

Programs

Certificates

Payments

Common Response Formats

Error Codes

Applications
Get All Applications
Retrieves a paginated list of all applications with optional filtering.

Endpoint: GET /admin/applications/all

Permissions: Admin only

Query Parameters:

Parameter	Type	Required	Default	Description
offset	integer	No	0	Pagination offset
limit	integer	No	10	Number of records per page
status	string	No	-	Filter by status: PENDING_PAYMENT, PAID, UNDER_REVIEW, APPROVED, REJECTED, CANCELLED, EXPIRED
search	string	No	-	Search by email
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "programType": "SIWES",
      "programId": "uuid",
      "learningMode": "ONLINE",
      "institution": "University of Lagos",
      "level": "100",
      "amount": 100000,
      "currency": "NGN",
      "status": "PENDING_PAYMENT",
      "paymentReference": "ref_123",
      "createdAt": "2026-04-14T12:00:00.000Z",
      "updatedAt": "2026-04-14T12:00:00.000Z"
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Update Application Status
Updates the status of a specific application.

Endpoint: PATCH /admin/applications/{id}/status

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	Application ID
Request Body:

json
{
  "status": "PENDING_PAYMENT"
}
Field	Type	Required	Description
status	string	Yes	New application status
Response (200 OK):

json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "programType": "SIWES",
    "programId": "uuid",
    "learningMode": "ONLINE",
    "institution": "University of Lagos",
    "level": "100",
    "amount": 100000,
    "currency": "NGN",
    "status": "PENDING_PAYMENT",
    "paymentReference": "ref_123",
    "createdAt": "2026-04-14T12:00:00.000Z",
    "updatedAt": "2026-04-14T12:00:00.000Z"
  }
}
Users
Create User
Creates a new user account. This endpoint is restricted to super admin only.

Endpoint: POST /admin/users

Permissions: Super Admin only

Request Body:

json
{
  "fullName": "string",
  "email": "user@example.com",
  "phoneNumber": "string",
  "role": "admin"
}
Field	Type	Required	Description
fullName	string	Yes	User's full name
email	string	Yes	User's email address
phoneNumber	string	Yes	User's phone number
role	string	Yes	User role: super, admin, user
Response (201 Created):

json
{
  "success": true,
  "message": "string",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08012345678",
    "role": "user",
    "profileImage": "https://res.cloudinary.com/demo/image.jpg",
    "academicInfo": {
      "institution": "University of Lagos",
      "courseOfStudy": "Computer Science",
      "level": "400"
    }
  }
}
Get All Users
Retrieves a paginated list of all users with optional filtering.

Endpoint: GET /admin/users

Permissions: Admin and Super Admin

Query Parameters:

Parameter	Type	Required	Default	Description
offset	integer	No	0	Pagination offset
limit	integer	No	10	Number of records per page
search	string	No	-	Search by email
role	string	No	-	Filter by role: super, admin, user
status	string	No	-	Filter by status: active, inactive
Response (200 OK):

json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "08012345678",
      "role": "user",
      "profileImage": "https://res.cloudinary.com/demo/image.jpg",
      "academicInfo": {
        "institution": "University of Lagos",
        "courseOfStudy": "Computer Science",
        "level": "400"
      }
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Get User by ID
Retrieves detailed information for a specific user.

Endpoint: GET /admin/users/{id}

Permissions: Admin and Super Admin

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Response (200 OK):

json
{
  "success": true,
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "08012345678",
    "role": "user",
    "profileImage": "https://res.cloudinary.com/demo/image.jpg",
    "academicInfo": {
      "institution": "University of Lagos",
      "courseOfStudy": "Computer Science",
      "level": "400"
    }
  }
}
Delete User
Deletes a user account. Super admin can delete any user; users can delete their own account.

Endpoint: DELETE /admin/users/{id}

Permissions: Super Admin or Self

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Get User Courses
Retrieves a user's enrolled courses filtered by status.

Endpoint: GET /admin/users/{id}/courses

Permissions: Admin and Super Admin

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Query Parameters:

Parameter	Type	Required	Description
status	string	No	Filter by status: all, pending, completed
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "applicationId": "uuid",
      "userId": "uuid",
      "status": "NOT_STARTED",
      "progressPercent": 0,
      "startedAt": "2026-04-15T12:00:00.000Z",
      "completedAt": "2026-04-18T12:00:00.000Z",
      "course": {
        "id": "uuid",
        "programId": "uuid",
        "title": "Intro to Web Development",
        "description": "Course overview and objectives",
        "orderIndex": 1,
        "isActive": true
      }
    }
  ]
}
Get User Certificates
Retrieves certificates issued to a specific user.

Endpoint: GET /admin/users/{id}/certificates

Permissions: Admin and Super Admin

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Query Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	No	Filter by specific course
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "courseId": "uuid",
      "studentCourseId": "uuid",
      "fileUrl": "https://res.cloudinary.com/demo/raw/upload/v1/cert.pdf",
      "fileName": "webdev-certificate.pdf",
      "fileType": "PDF",
      "mimeType": "application/pdf",
      "uploadedBy": "uuid",
      "issuedAt": "2026-04-30T12:00:00.000Z",
      "createdAt": "2026-04-30T12:00:00.000Z",
      "updatedAt": "2026-04-30T12:00:00.000Z"
    }
  ]
}
Activate User Account
Activates a deactivated user account.

Endpoint: PATCH /admin/users/activate/{id}

Permissions: Admin and Super Admin

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Deactivate User Account
Deactivates a user account.

Endpoint: PATCH /admin/users/deactivate/{id}

Permissions: Admin and Super Admin

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	User ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Courses
Get All Courses
Retrieves a paginated list of all courses with optional filtering.

Endpoint: GET /admin/courses

Permissions: Admin only

Query Parameters:

Parameter	Type	Required	Default	Description
offset	integer	No	0	Pagination offset
limit	integer	No	10	Number of records per page
isActive	boolean	No	-	Filter by active status
search	string	No	-	Search by title or description
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "programId": "uuid",
      "title": "Intro to Web Development",
      "description": "Course overview and objectives",
      "orderIndex": 1,
      "isActive": true
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Create Course
Creates a new course.

Endpoint: POST /admin/courses

Permissions: Admin only

Request Body:

json
{
  "programId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "string",
  "description": "string",
  "orderIndex": 0,
  "isActive": true
}
Field	Type	Required	Description
programId	string(uuid)	Yes	Associated program ID
title	string	Yes	Course title
description	string	No	Course description
orderIndex	integer	No	Display order (default: 0)
isActive	boolean	No	Whether course is active (default: true)
Response (201 Created):

json
{
  "success": true,
  "data": {
    "id": "uuid",
    "programId": "uuid",
    "title": "Intro to Web Development",
    "description": "Course overview and objectives",
    "orderIndex": 1,
    "isActive": true,
    "modules": [
      {
        "id": "uuid",
        "courseId": "uuid",
        "title": "Module 1: Foundations",
        "description": "Core fundamentals",
        "orderIndex": 1,
        "isActive": true,
        "outlines": [
          {
            "id": "uuid",
            "moduleId": "uuid",
            "parentId": "uuid",
            "title": "Introduction",
            "description": "Module kickoff",
            "orderIndex": 0,
            "isActive": true,
            "children": []
          }
        ]
      }
    ]
  }
}
Update Course
Updates course metadata.

Endpoint: PUT /admin/courses/{courseId}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
Request Body:

json
{
  "title": "string",
  "description": "string",
  "orderIndex": 0,
  "isActive": true
}
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Get Course Outline
Retrieves the complete outline tree for a course.

Endpoint: GET /admin/courses/{courseId}/outline

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
Response (200 OK):

json
{
  "success": true,
  "data": {
    "id": "uuid",
    "programId": "uuid",
    "title": "Intro to Web Development",
    "description": "Course overview and objectives",
    "orderIndex": 1,
    "isActive": true,
    "modules": [
      {
        "id": "uuid",
        "courseId": "uuid",
        "title": "Module 1: Foundations",
        "description": "Core fundamentals",
        "orderIndex": 1,
        "isActive": true,
        "outlines": [
          {
            "id": "uuid",
            "moduleId": "uuid",
            "parentId": "uuid",
            "title": "Introduction",
            "description": "Module kickoff",
            "orderIndex": 0,
            "isActive": true,
            "children": []
          }
        ]
      }
    ]
  }
}
Course Modules & Outlines
Create Module with Outlines
Creates a course module and its outlines in a single API call.

Endpoint: POST /admin/courses/{courseId}/modules

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
Request Body:

json
{
  "title": "string",
  "description": "string",
  "orderIndex": 0,
  "isActive": true,
  "outlines": []
}
Field	Type	Required	Description
title	string	Yes	Module title
description	string	No	Module description
orderIndex	integer	No	Display order
isActive	boolean	No	Active status
outlines	array	No	Nested outline structure
Response (201 Created):

json
{
  "success": true,
  "data": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Module 1: Foundations",
    "description": "Core fundamentals",
    "orderIndex": 1,
    "isActive": true,
    "outlines": [
      {
        "id": "uuid",
        "moduleId": "uuid",
        "parentId": "uuid",
        "title": "Introduction",
        "description": "Module kickoff",
        "orderIndex": 0,
        "isActive": true,
        "children": []
      }
    ]
  }
}
Update Module
Updates course module metadata.

Endpoint: PUT /admin/courses/{courseId}/modules/{moduleId}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
moduleId	string(uuid)	Yes	Module ID
Request Body:

json
{
  "title": "string",
  "description": "string",
  "orderIndex": 0,
  "isActive": true
}
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Replace Module Outline
Replaces the full module outline tree.

Endpoint: PUT /admin/courses/{courseId}/modules/{moduleId}/outline

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
moduleId	string(uuid)	Yes	Module ID
Request Body:

json
{
  "outlines": [
    {
      "title": "string",
      "description": "string",
      "orderIndex": 0,
      "children": []
    }
  ]
}
Response (200 OK):

json
{
  "success": true,
  "data": {
    "id": "uuid",
    "courseId": "uuid",
    "title": "Module 1: Foundations",
    "description": "Core fundamentals",
    "orderIndex": 1,
    "isActive": true,
    "outlines": []
  }
}
Schedules
Create Lesson Schedule
Creates a lesson schedule for a course.

Endpoint: POST /admin/courses/{courseId}/schedules

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
Request Body:

json
{
  "title": "string",
  "instructorName": "string",
  "scheduleType": "ONE_OFF",
  "weekdays": ["MONDAY"],
  "sessionDate": "2026-05-07",
  "startDate": "2026-05-07",
  "endDate": "2026-05-07",
  "startTime": "21:16",
  "endTime": "20:50",
  "platform": "GOOGLE_MEET",
  "meetingLink": "string",
  "meetingId": "string",
  "passcode": "string",
  "isActive": true
}
Field	Type	Required	Description
title	string	Yes	Schedule title
instructorName	string	Yes	Name of instructor
scheduleType	string	Yes	ONE_OFF or RECURRING
weekdays	array	No	Days of week (for recurring)
sessionDate	string(date)	Yes (ONE_OFF)	Specific session date
startDate	string(date)	Yes (RECURRING)	Start date for recurring
endDate	string(date)	Yes (RECURRING)	End date for recurring
startTime	string(time)	Yes	Session start time
endTime	string(time)	Yes	Session end time
platform	string	Yes	Meeting platform
meetingLink	string	Yes	Meeting URL
meetingId	string	No	Meeting ID
passcode	string	No	Meeting passcode
isActive	boolean	No	Active status
Response (201 Created): Returns the created schedule object.

Get Course Schedules
Retrieves all schedules for a course.

Endpoint: GET /admin/courses/{courseId}/schedules

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "courseTitle": "Web Development",
      "programId": "uuid",
      "title": "React Hooks Deep Dive",
      "instructorName": "Mr. Chinedu Okeke",
      "scheduleType": "RECURRING",
      "weekdays": ["MONDAY"],
      "sessionDate": "2026-05-01",
      "startDate": "2026-05-01",
      "endDate": "2026-08-01",
      "startTime": "18:00",
      "endTime": "20:00",
      "platform": "GOOGLE_MEET",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "meetingId": "abc-defg-hij",
      "passcode": "cloud2026",
      "isActive": true,
      "createdAt": "2026-04-29T12:00:00.000Z",
      "updatedAt": "2026-04-29T12:00:00.000Z"
    }
  ]
}
Update Schedule
Updates an existing lesson schedule.

Endpoint: PATCH /admin/schedules/{scheduleId}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
scheduleId	string(uuid)	Yes	Schedule ID
Request Body: Same as create schedule (all fields optional for update)

Response (200 OK): Returns the updated schedule object.

Delete Schedule
Deletes a lesson schedule.

Endpoint: DELETE /admin/schedules/{scheduleId}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
scheduleId	string(uuid)	Yes	Schedule ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Toggle Schedule Active State
Toggles the active state of a lesson schedule.

Endpoint: PATCH /admin/schedules/{scheduleId}/toggle-active

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
scheduleId	string(uuid)	Yes	Schedule ID
Response (200 OK): Returns the updated schedule object with toggled isActive status.

Assignments & Submissions
Create Assignment
Creates an assignment for a module.

Endpoint: POST /admin/courses/{courseId}/modules/{moduleId}/assignments

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
courseId	string(uuid)	Yes	Course ID
moduleId	string(uuid)	Yes	Module ID
Request Body:

json
{
  "title": "string",
  "description": "string",
  "instructions": "string",
  "dueAt": "2026-05-07T08:46:21.859Z",
  "maxScore": 1000,
  "isActive": true
}
Field	Type	Required	Description
title	string	Yes	Assignment title
description	string	No	Assignment description
instructions	string	No	Detailed instructions
dueAt	string(date-time)	Yes	Due date and time
maxScore	integer	No	Maximum possible score
isActive	boolean	No	Active status
Response (201 Created): Returns the created assignment object.

Update Assignment
Updates an existing assignment.

Endpoint: PUT /admin/assignments/{assignmentId}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
assignmentId	string(uuid)	Yes	Assignment ID
Request Body: Same as create assignment (all fields optional for update)

Response (200 OK): Returns the updated assignment object.

Get All Assignments
Retrieves a paginated list of all assignments with optional filtering.

Endpoint: GET /admin/assignments

Permissions: Admin only

Query Parameters:

Parameter	Type	Required	Description
offset	integer	No	Pagination offset
limit	integer	No	Number of records per page
courseId	string(uuid)	No	Filter by course
moduleId	string(uuid)	No	Filter by module
isActive	boolean	No	Filter by active status
search	string	No	Search by title
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "moduleId": "uuid",
      "title": "Build REST API",
      "description": "Create endpoints for auth and users",
      "instructions": "Submit your repo link and short report",
      "dueAt": "2026-05-10T23:59:59.000Z",
      "maxScore": 100,
      "isActive": true,
      "createdAt": "2026-05-01T12:00:00.000Z",
      "updatedAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Get Assignment Submissions
Retrieves all submissions for a specific assignment.

Endpoint: GET /admin/assignments/{assignmentId}/submissions

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
assignmentId	string(uuid)	Yes	Assignment ID
Query Parameters:

Parameter	Type	Required	Description
offset	integer	No	Pagination offset
limit	integer	No	Number of records per page
status	string	No	Filter by status: SUBMITTED, REVIEWED, NEEDS_RESUBMISSION
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "assignmentId": "uuid",
      "userId": "uuid",
      "studentCourseId": "uuid",
      "responseText": "My submission notes",
      "attachmentUrl": "https://res.cloudinary.com/demo/raw/upload/v1/assignment.zip",
      "attachmentName": "solution.zip",
      "attachmentMimeType": "application/zip",
      "attachments": [
        {
          "id": "uuid",
          "submissionId": "uuid",
          "fileUrl": "https://res.cloudinary.com/demo/raw/upload/v1/assignment.zip",
          "fileName": "solution.zip",
          "mimeType": "application/zip",
          "createdAt": "2026-05-01T12:00:00.000Z",
          "updatedAt": "2026-05-01T12:00:00.000Z"
        }
      ],
      "submittedAt": "2026-05-01T12:00:00.000Z",
      "status": "SUBMITTED",
      "score": 85,
      "feedback": "Good work, improve validation coverage.",
      "reviewedBy": "uuid",
      "reviewedAt": "2026-05-02T09:00:00.000Z",
      "assignment": {
        "id": "uuid",
        "courseId": "uuid",
        "moduleId": "uuid",
        "title": "Build REST API",
        "description": "Create endpoints for auth and users",
        "instructions": "Submit your repo link and short report",
        "dueAt": "2026-05-10T23:59:59.000Z",
        "maxScore": 100,
        "isActive": true,
        "createdAt": "2026-05-01T12:00:00.000Z",
        "updatedAt": "2026-05-01T12:00:00.000Z"
      },
      "createdAt": "2026-05-01T12:00:00.000Z",
      "updatedAt": "2026-05-01T12:00:00.000Z"
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Review Assignment Submission
Reviews and grades an assignment submission.

Endpoint: PATCH /admin/submissions/{submissionId}/review

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
submissionId	string(uuid)	Yes	Submission ID
Request Body:

json
{
  "score": 0,
  "feedback": "string",
  "status": "REVIEWED"
}
Field	Type	Required	Description
score	integer	No	Score awarded
feedback	string	No	Reviewer feedback
status	string	Yes	New status: REVIEWED or NEEDS_RESUBMISSION
Response (200 OK): Returns the updated submission object.

Programs
Create Program
Creates a new program.

Endpoint: POST /admin/programs

Permissions: Admin only

Request Body:

json
{
  "title": "string",
  "description": "string",
  "price": 2,
  "duration": "string",
  "currency": "NGN",
  "isActive": true,
  "programType": "SIWES"
}
Field	Type	Required	Description
title	string	Yes	Program title
description	string	No	Program description
price	number	Yes	Program price
duration	string	Yes	Program duration
currency	string	Yes	Currency code (e.g., NGN)
isActive	boolean	No	Active status (default: true)
programType	string	Yes	Type of program
Response (201 Created):

json
{
  "success": true,
  "message": "string"
}
Update Program
Updates an existing program.

Endpoint: PUT /admin/programs/{id}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	Program ID
Request Body: Same as create program (all fields optional for update)

Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Deactivate Program
Deactivates a program (soft delete).

Endpoint: DELETE /admin/programs/{id}

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	Program ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Activate Program
Activates a previously deactivated program.

Endpoint: PATCH /admin/programs/{id}/activate

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
id	string(uuid)	Yes	Program ID
Response (200 OK):

json
{
  "success": true,
  "message": "string"
}
Certificates
Upload Certificate
Uploads a certificate for a completed student course.

Endpoint: POST /admin/student-courses/{studentCourseId}/certificate

Permissions: Admin only

Path Parameters:

Parameter	Type	Required	Description
studentCourseId	string(uuid)	Yes	Student course ID
Request Body: multipart/form-data

Field	Type	Required	Description
certificate	file(binary)	Yes	Certificate file (PDF recommended)
Response (201 Created):

json
{
  "success": true,
  "message": "Certificate uploaded successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "courseId": "uuid",
    "studentCourseId": "uuid",
    "fileUrl": "https://res.cloudinary.com/demo/raw/upload/v1/cert.pdf",
    "fileName": "webdev-certificate.pdf",
    "fileType": "PDF",
    "mimeType": "application/pdf",
    "uploadedBy": "uuid",
    "issuedAt": "2026-04-30T12:00:00.000Z",
    "createdAt": "2026-04-30T12:00:00.000Z",
    "updatedAt": "2026-04-30T12:00:00.000Z"
  }
}
Payments
Get All Payments
Retrieves a paginated list of all payments with optional filtering.

Endpoint: GET /admin/payments

Permissions: Admin only

Query Parameters:

Parameter	Type	Required	Description
offset	integer	No	Pagination offset
limit	integer	No	Number of records per page
status	string	No	Filter by status: INITIATED, PENDING, SUCCESSFUL, FAILED, EXPIRED, CANCELLED, REDUNDANT
userId	string(uuid)	No	Filter by user ID
Response (200 OK):

json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicationId": "uuid",
      "provider": "PAYSTACK",
      "reference": "ref_123",
      "amount": 100000,
      "currency": "NGN",
      "status": "SUCCESSFUL",
      "createdAt": "2026-04-14T12:00:00.000Z",
      "updatedAt": "2026-04-14T12:00:00.000Z"
    }
  ],
  "resultSet": {
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Common Response Formats
Success Response
All successful responses follow this structure:

json
{
  "success": true,
  "data": { ... },  // or "message": "string", or "users": [...]
  "resultSet": {    // for paginated responses
    "count": 10,
    "offset": 0,
    "limit": 10,
    "total": 30
  }
}
Error Response (401 Unauthorized)
json
{
  "success": false,
  "message": "Access Denied. Unauthorized to access resource"
}
Error Codes
Status Code	Description
200	Success - Request completed successfully
201	Created - Resource created successfully
401	Unauthorized - Authentication failed or insufficient permissions
404	Not Found - Requested resource does not exist
422	Unprocessable Entity - Validation error
500	Internal Server Error - Server-side error
Notes
Authentication: All endpoints require a valid authentication token with appropriate admin role permissions.

Pagination: For paginated endpoints, use offset and limit query parameters.

UUID Format: All ID fields expect and return UUID format (e.g., 3fa85f64-5717-4562-b3fc-2c963f66afa6).

Date Format: All dates are returned in ISO 8601 format (UTC).

File Uploads: Certificate uploads require multipart/form-data content type.

Role Hierarchy:

super - Full system access

admin - Administrative access (limited compared to super)

user - Regular user access

