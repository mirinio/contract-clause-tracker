

# Decisions

## Backend
- Use FastApi since it faster to spin up something quickly out of the box.
- Use Sqlite for a simple database which is nice for small demos.
- Simple schema of Documents and Clauses.

### What I would change/extend
- Use some sort of config handling where I can deceive who the API audience will be for CORS handling.
- Use a more robust database like Postgres if I wanted to scale this up.
- Add some sort of authentication and authorization if I wanted to have different users with different permissions.
- Change code structure to use some layering. move business logic out of the main.py into serivces or handlers.
- Since the files might be pretty big, I would use Websockets and some queueing mechanism in order to not block the user on the upload.
- Run multiple backend containers behind a load balancer.
- Store uploaded files in a storage and save only metadata like path, name, uploadTime etc. to DB. 
- AI features: 
  - Auto suggestions for clause types
  - Risk Scoring
  - missing clause detection
  - summarization of clauses
  - drafting assistant for contract creation

## Frontend
- Fast styling use Tailwind, easy to add "ng add tailwind" done.
- api client service for backend

### What I would change/extend
- generate apiClient based on openapi spec.
- use ngrx for state management if it gets bigger.
- would like to try angular aria with tailwind for nicer styling.





