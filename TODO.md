# To-Do

## Meta (design, ideas, etc.)

- [x] Redesign the homepage to make it less confusing for the end user
- [ ] Redesign friend standalone page to make it less confusing for the end user

## Web Client

- [ ] Remove container for deployed frontend; switch to just serving static files from a folder
- [x] Fix 405 error on deployment
- [x] Fix proportions of login and signup page forms to better fit mobile screen sizes
- [ ] Add login/signup with OAuth
- [x] Write a TOS for the signup
- [x] Make the TOS button a target="\_blank" anchor or a popup
- [ ] Add "edit" and "delete" functionality to interactions pages
- [ ] Add the ability to set emoji as the pfp
- [ ] Remove birthdays from "urgent friends" section of Home
- [ ] Add profile page that has name and user options fields (including time zone)

## Mobile Client

- [x] Create React Native project in its own directory in this repository
- [ ] Create login/signup screen and a temporary home screen to show that you've successfully logged in/out

## API & Database

- [ ] Migrate MariaDB to Postgresql
- [ ] Add "time zone" column to Users table
- [ ] Watch [this video](https://youtu.be/FsB_nRGdeLs?si=49Gu9p7P4JaNyGwI) and adress each of the following security domains:
- [ ] Remove birthdays from "urgent friends" section of Home
    - [ ] Rate limiting/DDOS
    - [ ] CORS
    - [ ] SQL/NoSQL injection
    - [ ] Firewalls
    - [ ] VPNs
    - [ ] CSRF
    - [ ] XSS
