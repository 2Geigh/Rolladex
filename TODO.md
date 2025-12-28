# myFriends To-Do List

## Front-end

- [x] Add React-Router routes to Main() or App()
- [x] Create login page component
- [x] Create registration page component
- [ ] Create homepage
  - [x] Create header/nav component
  - [x] Create friends list component
    - [x] Create individual friend component
  - [x] Create meetups list component
    - [x] Create individual meetup component
- [ ] Create Friends page component
  - [x] Create standalone Friend component
- [ ] Create Meetups page component
  - [ ] Create standalone Meetup component
- [ ] Go through the following: [HowToTestFrontEnd.com](https://howtotestfrontend.com/courses/jest-vitest-fundamentals "A Vitest tutorial") to add tests to the front-end
- [ ] Add Node(/Express?) routing middleware
- [ ] Create terms of service page and route
- [ ] Move user, friend, and meetup sample data to the backend such that it instantiates every time the database is created
- [x] 404 page

## Back-end

- [ ] Create terms of service text
- [ ] Create V2 of login system
  - [ ] Migrate database and models to remove username and password fields
  - [ ] Update frontend input forms
  - [ ] Registration mechanism
    - [ ] Captcha
    - [ ] When captcha passes, direct to login mechanism
  - [ ] Login mechanism
    - [ ] When registered email is inputted, create a 60-minute JWT
    - [ ] Email a link to login with the JWT
- [ ] Create microservices for each route
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add functional tests (probably for main.go but verify first)
- [ ] Design acceptance tests
- [ ] Add performance tests
- [x] Make util.ReportHttpError modular, so that you can specify the errorMessage and errorCode as arguments
- [ ] (OPTIONAL) Add smoke tests

## Other

- [ ] Add end-to-end tests
- [ ] Plan out UI/routing design, what the application is actually gonna look like when it's done, so we know what to code and how to structure the code
- [ ] Add said routes, and figure out if that's something on the front or backend (like should I just have a different React root node in each route's <body>?)
- [ ] For every line of code, run it through an LLM and ask it "how would a senior dev write this"
