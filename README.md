# Code List
This is a small application which I Developed as Task assigned by Raj Vikramaditya aka Striver 
for submission towards internship task with proposed deadline of 3 days.

# Usage
This application can be used to store and test the code submission.

# Features
- Take submission of code online
- Implement custom Redis Cache for decreasing DB calls
- Integrated https://judge0.com compiler application
- Store last updated Input and Output

# Deployment
## Local
To test it locally run.

Clone the repository
```bash
git clone https://github.com/vinitagarwal007/code-list.git
```
### Setup Environment
Rename ".env copy" file to ".env"

Fill in environment variables


### Create two instance of terminal in vscode.

Run the frontend in one terminal
```bash
cd ./code-list/frontend
npm i
npm run dev
```
Run the backend in other terminal
```bash
cd ./code-list/backend
npm i
ts-node ./src/index.ts
```


## Production
Clone the repository using above mentioned procedure.
### Frontend
```bash
    npm build
    serve -s build
```
### Backend
```bash
    cd ./backend
    npm i && tsc
    node ./src/index.js
```


## Tech Stack

**Client:** React, TypeScript

**Server:** Node, Express

**Database:** MySQL, Redis


## Demo

https://striver-task-code.vercel.app/


## Todo
- Responsiveness
- Low level error handeling