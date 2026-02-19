# To-Do

## Meta (design, ideas, etc.)

- [ ] Add passwordless sign-in requirement to VPS
- [ ] Update README.md to revise the dev and deployment environment instantiation to just `docker-compose` and list Docker engine as a dependency for the project
- [x] Redesign the homepage to make it less confusing for the end user
- [ ] Redesign friend standalone page to make it less confusing for the end user
- [ ] Read [this documentation](https://react.dev/reference/rules) and apply each of the following principles across the client-side codebases:
  - [ ] Component and Hook Purity
    - [ ] Components and Hooks must be idempotent
    - [ ] Side effects must run outside of render
    - [ ] Props and state are immutable
    - [ ] Return values and arguments to Hooks are immutable
    - [ ] Values are immutable after being passed to JSX  
  - [ ] React calls Components and Hooks
    - [ ] Never call component functions directly
    - [ ] Never pass around Hooks as regular values
  - [ ] Rules of Hooks
    - [ ] [Only call Hooks at the top level](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level)
    - [ ] [Only call Hooks from React functions](https://react.dev/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions)

## Web Client

- [ ] Remove container for deployed frontend; switch to just serving static files from a folder
- [x] Fix 405 error on deployment
- [x] Fix proportions of login and signup page forms to better fit mobile screen sizes
- [ ] Add login/signup with OAuth
- [x] Write a TOS for the signup
- [x] Make the TOS button a target="\_blank" anchor or a popup
- [ ] Add "edit" and "delete" functionality to interactions pages
- [ ] Replace pfps with emoji
- [ ] Remove birthdays from "urgent friends" section of Home
- [ ] Add profile page that has name and user options fields (including time zone)
- [x] Scale homepage UI for laptop and mobile dimensions

## Mobile Client

- [x] Create React Native project in its own directory in this repository
- [ ] Create login/signup screen and a temporary home screen to show that you've successfully logged in/out

## API & Database

- [ ] Add autodeletion of sessions to clear database
- [x] [Rename functions that start with "get"/"Get"](https://google.github.io/styleguide/go/decisions#getters)
- [ ] Replace pfps with emoji
- [ ] Migrate MariaDB to Postgresql
- [ ] Add "time zone" column to Users table
- [x] Remove birthdays from "urgent friends" section of Home
- [ ] Watch [this video](https://youtu.be/FsB_nRGdeLs?si=49Gu9p7P4JaNyGwI) and adress each of the following security domains:
  - [x] Rate limiting/DDOS
    - [ ] Add rate limiting to Nginx
  - [ ] CORS
  - [ ] SQL/NoSQL injection
- [ ] Remove birthdays from "urgent friends" section of Home
  - [ ] Rate limiting/DDOS
  - [x] CORS
  - [x] SQL/NoSQL injection
  - [ ] Firewalls
  - [ ] VPNs
  - [ ] CSRF
  - [ ] XSS
