## Install

from root run `npm install` to install backend dependencies.

from root/public run `npm install` to install frontend dependencies.

## Run the App

from root run `nodemon` to start nodejs server.

open another CL and from root/public run `npm run tsc:w` to compile ts files and watching them for changes.

when ts file changes, the tsc:w will reCompile the files then the nodemon will restart the server.

so you don't need to do any thing except refresh your browser.
