# To-Do

## Meta (design, ideas, etc.)

- [ ] Redesign the homepage to functionally resemble a rolodex (It should be like a contact list with a notification hub at the top)

## Web Client

- [ ] Remove container for deployed frontend; switch to just serving static files from a folder
- [x] Fix 405 error on deployment
- [x] Fix proportions of login and signup page forms to better fit mobile screen sizes
- [ ] Add login/signup with OAuth
- [ ] Write a TOS for the signup
- [x] Make the TOS button a target="\_blank" anchor or a popup

## Mobile Client

- [ ] Create React Native project in its own directory in this repository
- [ ] Create login/signup screen and a temporary home screen to show that you've successfully logged in/out

## API & Database

- [ ] Migrate MariaDB to Postgresql
- [ ] Watch [this video](https://youtu.be/FsB_nRGdeLs?si=49Gu9p7P4JaNyGwI) and adress each of the following security domains:
    - [ ] Rate limiting/DDOS
    - [ ] CORS
    - [ ] SQL/NoSQL injection
    - [ ] Firewalls
    - [ ] VPNs
    - [ ] CSRF
    - [ ] XSS
