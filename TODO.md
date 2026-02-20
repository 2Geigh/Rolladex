# To-Do

## Meta (design, ideas, etc.)

- [x] Redesign the homepage to functionally resemble a rolodex (It should be like a contact list with a notification hub at the top)

## Web Client

- [ ] Remove container for deployed frontend; switch to just serving static files from a folder
- [x] Fix 405 error on deployment
- [x] Fix proportions of login and signup page forms to better fit mobile screen sizes
- [ ] Add login/signup with OAuth
- [x] Write a TOS for the signup
- [x] Make the TOS button a target="\_blank" anchor or a popup
- [x] Add CSRF token to loginSessionContext
- [x] Add CSRF tokens to every API request

## Mobile Client

- [ ] Create React Native project in its own directory in this repository
- [ ] Create login/signup screen and a temporary home screen to show that you've successfully logged in/out

## API & Database

- [ ] Add automatic Sessions row deletion upon session expiration
- [/] Watch [this video](https://youtu.be/FsB_nRGdeLs?si=49Gu9p7P4JaNyGwI) and adress each of the following security domains:
  - [x] Rate limiting/DDOS
    - [x] Add IP address-specific rate limiting to the API
    - [ ] Add IP address-specific rate limiting to VPS' NGINX
  - [x] SQL/NoSQL injection
    - [x] Prepare all SQL statements that rely on user inputs in some way
  - [x] CSRF (cross-site request forgery)
    - [x] Create a database table called "CsrfTokens"
    - [x] Add CSRF token generation to user session validation
      - [x] The token should be sent in the response with the user data
    - [x] Make very API request require validating the CSRF token according to the database
  - [ ] XSS
    - [ ] Sanitize all user inputs using github.com/microcosm-cc/bluemonday
- [ ] Add HTTP secure transport security to VPS' Nginx
