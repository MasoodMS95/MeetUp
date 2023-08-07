# `The Meetup`

## `Live Link`: https://meet-up-ty0l.onrender.com

## `Overview`
This project allows users to find others in their local community to participate in common interest groups/events. It's goal is to help inspire people to come together and foster their community.

![Alt text](/images/preview.png)

## `Technologies Used`
This project is composed using:
 * React
 * NodeJS
 * Redux
 * Express
 * Sequelize

## `Startup Steps`
Instruction on how to setup the repo locally.
* Clone the repo
* Backend
  * Navigate to /backend from root
  * Create a .env in the root of backend with the folllowing:
  ``````
  PORT=8000
  DB_FILE=db/dev.db
  JWT_SECRET={GENERATE YOUR OWN SECRET}
  JWT_EXPIRES_IN=604800
  SCHEMA=Meetup
  ``````
  * Run the rebuild script from the backend: npm run rebuild
  * Run npm start

* FrontEnd
  * In a separate terminal, navigate to /frontend from root
  * Run npm i
  * Run npm start
  * If site doesn't open, navigate to localhost: http://localhost:3000/
