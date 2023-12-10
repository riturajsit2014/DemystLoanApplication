
## To run the application
1. move to the project repository
2. Run the following command:
    * To run via docker:
        - docker build -t backend .
        - docker run --rm -it -d -p 3000:3000 backend
    * To run without docker:
        - cd accounting-software
        - npm install
        - npm start
        - cd ../decision-engine
        - npm install
        - npm start
        - cd ../backend
        - npm install
        - npm start
    * Once the application is up and running, you can access the front-end using: http://localhost:3000
3. To run the unit test cases:
    * Move to the backend directory
    * npm run test
