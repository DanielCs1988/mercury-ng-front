## Mercury App

Mercury is a social media app, partially inspired by Facebook. It is my very own pet project where 
I can tinker with shiny new web technologies, like GraphQL and WebSockets.

The project itself is powered by Angular 6 on the front, which in turn fetches and uploads data to 4 (+1, indirectly)
different microservices. All the details can be found below and the individual repository links are as follows:
1. [Social Feed](https://github.com/DanielCs1988/mercury-feed-api)
2. [Chat](https://github.com/DanielCs1988/mercury-chat-api)
3. [Events](https://github.com/DanielCs1988/mercury-events-api)
4. [News](https://github.com/DanielCs1988/mercury-news-api)

The project is also deployed on Heroku with the expception of the chat API, which is a work in progress (2018.07.17.).
Link: TBA 

## Social Feed API

The feed API is actually two individual APIs in chained together. The persistence layer is provided by a PostgreSQL
database, which is controlled by a [Prisma](https://www.prisma.io/docs/) API. It is essentially a GraphQL
server that acts like an ORM specialized for serving and taking data in the GraphQL way. It supports all the three major
operations of the specifications: queries, mutations and subscriptions. However, features such as authentication and
caching (via Redis for example) is not possible on this level, so another API is needed to filter all that information,
providing specific ways to access the information contained within. 

That is where the layer with which we communicate in the Angular SPA presents itself. It is a GraphQL server based on
Node Express and a socket server implementation, capable of handling the full spectrum of the specifications. Here,
I provide business logic to access my data layer, the Prisma API. Every operation including posts, comments, likes and
user profiles are located here, users with the right authorizations (more details below) are allowed access only to
specific entries. Both normal HTTP and WebSocket requests are allowed.

## Chat API

This one is using Java and my own framework. The framework itself has dependency injection via the main
app container, inspired by Spring, a basic HTTP server and a WebSocket server built up from the basic 
Socket/SocketServer class. It can receive and maintain a socket connection initiated from a standard browser.
Socket connections can be authenticated using a built-in middleware on the handshake event, so connections will not
instantiate if the attempt is rejected. The messages have a label (route) and a payload (any Json object) part and
are delegated to the appropriate (annotated) handler method, just like with HTTP endpoints.

The API itself transmits real-time messages to recipients and dishes out chat history from a PostgreSQL database,
while also keeping track of and sending the currently logged in users' list. Instead of using an ORM for this simple 
use case, I devised simple and neat DAO objects and a generic SQL helper class to be used with JDBC.    

## Events API

A Node Express server written in Typescript provides the REST endpoints for events. Basic operations are supported,
including joining and leaving events. I used a MongoDB database here and Mongoose ORM to communicate with it.

## News API

The news API is basically a relay communicating with multiple 3rd party APIs, fetching and providing weather information
based on (geo)location and filtered news to the frontend. It is written in Spring, and while there are plans to add
persistence layer with a brand new feature, it does not have one right now. I have also written a plugin to handle
HTTP requests. Using the same pattern as Spring JPA, the developer only has to define an interface - in this case,
with an annotation - and write appropriate names reflecting the kind of request he or she wants to make, such as
getJsonWithBearerAndQuery, then the correct 'implementation' of the interface will be provided at runtime,
making such requests simple and powerful.

## Authentication and User profiles

Using the popular OAuth method, the login button will redirect the user to the Auth0 page where they can log in via
their google account, then an RS256 encoded (and signed) JWT token is created and used throughout the microservices,
providing common ground for authentication and authorization. What's more, profile data is fetched directly from google,
not including the email address (currently).

## The Angular App

All these microservices are connected in the Angular 6 SPA. The feed API is the special case here, because it uses the
GraphQL specification instead REST, so I have chosen to work with the new [Apollo 2](https://www.apollographql.com/)
client. This library is integrated into Angular, and is using the also new HttpClient from it. Caching is
handled by a datastore similar to Redux. The connection itself is split between regular HTTP for queries and mutations,
and WebSocket for subscriptions. Both the datastore and the server can be accessed using the unique GQL query language,
allowing me to fetch complex data in a simple, clean way, without overfetching or having to run multiple rounds.

The chat API is connected though my own small library, which is using [RxJS](https://rxjs-dev.firebaseapp.com/) to
wrap socket communications in observables (and promises where appropriate). It also provides caching mechanism for 
messages that could not be sent because the connection was broken, and automatically attempts to reconnect to the
server.

The news and events API is using Angular's own HttpClient to reach the servers. Even though Apollo has it's own
solutions for caching and optimistic UI, the rest of the services can also handle it in their respective services,
mostly using RxJS and JS collections, especially hashmaps. Plans are made for switching entirely to an Angular compatible datastore
solution, in order for the project to scale better in the future.
