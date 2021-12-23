# guru-api-to-rss
this small web app let you create an endpoint to simulate RSS of Guru.com, since they disabled their RSS link

# Requirements
you have to have api key, and you can get it by applying on your profile settings page.

# how to use
npm install

node index.js

after that it will create a live page at port 3000 but for sure you can use your way like wsgi to make this public rss link for your rss feed, please note that there is a limit of 60 requests per minute.

you have to change the client_id and client_secret in index.js
