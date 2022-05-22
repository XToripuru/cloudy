# Cloudy
Basic example of file hosting service

You can see it in action in this [video](https://www.youtube.com/watch?v=gg5kk1sIKPg)

**Backend** - Rust
* with [actix](https://actix.rs) crate
* [server](https://github.com/XToripuru/cloudy/tree/master/server)

**Frontend** - React
* [client](https://github.com/XToripuru/cloudy/tree/master/client) contains both code for React and basic Node.js file rendering used for development

## Usage
Cloudy allows you to quickly host files via dropping them on website,
then files are saved on the server and ID is generated which can be used to download that file,
ID is a part of the link: `<domain>/api/download/<id>`