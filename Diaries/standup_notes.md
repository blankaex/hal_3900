# Hayden Standup Notes

## Planned for this sprint
* Setup backend boilerplate with `Node.js`

## Completed so far
* Basic boilerplate in pure `Node.js` (refer to previous commit)
* Wrote basic quickstart steps in `/Hal_3900/readme.md` 
* Redid boilerplate with `express` to manage routing, content-type checking, etc.
    * Routes specified in `/Hal_3900/routes.js`
    * Serves static `.html` files from `/public`
* Development mode server runs with `nodemon` (automatically restarts server on file touch)

## Obstacles/Blockers
* Need a frontend to interact with `Node.js`
* Getting the right versions of `Node.js` and `@vue-cli` took over 3 hours

## To-do
* Implement `MongoDB` support for persistent storage
* Figure out how frontend and backend are supposed to interact
    * Somehow I feel like serving static files won't quite cut it
* Add some other standard middleware like body-parser, cors, etc
    * Idk what they do

## Other Stuff
* Apparently `socket.io` is a must-have for real-time
    * Can get realtime chat between clients on a server in 10 mins
    * https://socket.io/
* `TensorFlow 2.0` came out a few days ago, we should use it
    * Apparently a lot easier and nicer to use than 1.0
    * Concepts all transfer across, code is a lot more succinct
    * https://www.tensorflow.org/community/roadmap

## Resources
* `Node.js` crash course
    * https://youtu.be/fBNz5xF-Kx4
* `express` crash course
    * https://youtu.be/L72fhGm1tfE
* Full Stack `express`, `Vue.js`, `MongoDB`
    * https://youtu.be/j55fHUJqtyw (Node/express)
    * https://youtu.be/X-JZ-QPApUs (Vue)
    * https://youtu.be/W-b9KGwVECs (Deployment)
