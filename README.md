# Rolladex

A webapp to help manage and maintain the relationships in your IRL social network.

## Dependency Management

### Frontend (`/frontend`)

To install the frontend npm dependencies, run
`$ npm install # or pnpm install or yarn install` in `/frontend`.

The frontend also depends on the [Live Sass Compiler](https://open-vsx.org/extension/glenn2223/live-sass) VSCode/Codium extension.

Once installed, trigger "Watch Sass" within VSCode/Codium and it should automatically compile all the `.scss` files in the frontend to `.css` and `.css.map` files in the same directories.

## Usage

### Frontend (`/frontend`)

### Available Scripts

In `/frontend`, you can run:

#### `$ npm run dev`

Runs the app in the development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

#### `$ npm run build`

Builds the app for production to the `/frontend/dist` folder.

The build is minified and the filenames include the hashes.

### Backend (`/backend`)

In `/backend`, compile the API binary by running `$ make`.

Execute the API binary at `/backend/bin/main.out`.

The binary will create and seed `/backend/database/myFriends.db` SQLite database file automatically.

## Literature

[Hill and Dunbar, 2003](https://www.researchgate.net/publication/281203308_Social_Network_Size_in_Humans)
