# Setup

- open terminal and enter `git clone https://github.com/nikp29/Telescope`
- `cd Telescope`
- get env file from the Shub's favorite person
- `nano .env`
- paste the contents of the file nikhil sent you and type `control x`, `Y`, `enter`
- install LTS version of Node.js from here: https://nodejs.org/en/download/
- `npm install`
- `brew install watchman`
- `npm install -g react-native-cli`
- attempt to start by running `npm start`
- if this doesnt work run `sudo npm install --unsafe-perm -g expo-cli`
- now expo should work
- if bundler still unable to build run `npm install -g expo-cli`
- Download https://apps.apple.com/us/app/expo-go/id982107779 on your iphone
- Once expo has started a new window in your browser should have open and there should be a QR code.
- open camera app and scan the QR code, and test

## Running the app after intial install

- open a new terminal window
- `cd Telescope`
- `git pull`
- `npm start`
