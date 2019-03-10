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

## Resources
* `Node.js` crash course
    * https://youtu.be/fBNz5xF-Kx4
* `express` crash course
    * https://youtu.be/L72fhGm1tfE
* Full Stack `Vue.js`, `express`, `MongoDB`
    * https://youtu.be/j55fHUJqtyw (Node/express)
    * https://youtu.be/X-JZ-QPApUs (Vue)
    * https://youtu.be/W-b9KGwVECs (Deployment)
