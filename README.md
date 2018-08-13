# Mercury App

Mercuy is a social media app using Angular 6 and 4 + 1 microservices with multiple backend technologies, 
including my own Java microframework, Spring, NodeJS, GraphQL and Websockets.

1. [Social Feed](https://github.com/DanielCs1988/mercury-feed-api)
2. [Chat](https://github.com/DanielCs1988/mercury-chat-node)
3. [Events](https://github.com/DanielCs1988/mercury-events-java)
4. [News](https://github.com/DanielCs1988/mercury-news-api)

+1: The Prisma API, more information below (there is no repository I can expose).

## Social Feed API

The feed API is actually two individual APIs chained together. The persistence layer is provided by a PostgreSQL
database, with a [Prisma](https://www.prisma.io/docs/) ORM wrapped around it. It is essentially a GraphQL API
configured to handle data using GraphQL queries. It supports all the three major
operations of the specification: queries, mutations and subscriptions. However, features such as authentication and
caching (via Redis for example) is not possible on this level, so another API is needed to filter the information,
providing a secure way to access it. 

That is exactly what the business layer is there for. It is using [GraphQL-Yoga](https://github.com/prismagraphql/graphql-yoga), which
 is a GraphQL library based on
Node Express and WebSockets, capable of handling the full spectrum of the specification.
 Every operation, including posts, comments, likes and
user profiles are located here. Users are only allowed access to specific entries based on their user credentials.

## Chat API

A Node Express server written in Typescript, using [socket.io](https://socket.io/) to handle the WebSocket connections. Persistence is provided by MongoDB via the
Mongoose ORM.

## Events API

The events API is an HTTP server using pure Java and my own microframework. The framework wraps around the basic built-in HttpServer
implementation and provides route configuration via annotations, similarly to Spring. It is also a full-fledged IoC
container exposing features such as dependency injection, aspect weaving, middlewares for HTTP and WebSocket connections, and HTTP request utility classes generated runtime
like Spring does with interfaces extending the JpaRepository. It also contains a WebSocket server built from the ground-up by me with the same features as the HTTP server.

Instead of an ORM, the API is using DAO objects and a generic SQL helper class with raw JDBC and PostgreSQL. 

## News API

The news API fetches and provides news and weather information
based on (geo)location and custom filters. It is written in Spring and I am planning to extend it with a feature
that will allow public personas to register and publish posts. Normal users will then be able to subscribe to those
personas and get updates from them.

## Authentication and User profiles

Using the popular OAuth method, the login button redirects the user to the [Auth0](https://auth0.com/) page where they can log in via
their google account, then an RS256 encoded (and signed) JWT token is created and used throughout the microservices,
providing common ground for authentication and authorization. What's more, profile data is fetched directly from google,
not including the email address.

## The Angular App

All these microservices are connected in the Angular 6 SPA. The feed API is the special case here, because it uses the
GraphQL specification instead REST, so I have chosen to work with the new [Apollo 2](https://www.apollographql.com/)
client. This library is integrated into Angular, and is using the Angular 6 HttpClient internally. Caching is
handled by a datastore similar to Redux. The connection itself is split between regular HTTP for queries and mutations,
and WebSocket for subscriptions. Both the datastore and the server can be accessed using the unique GQL query language,
allowing users to fetch complex data in a simple and clean way, without overfetching or having to hit multiple endpoints.

The chat API is connected though the socket.io client, using [RxJS](https://rxjs-dev.firebaseapp.com/) to
wrap socket communications in observables. Caching is handled by NgRX, an Angular implementation of Redux.

The news and event API are using Angular's own HttpClient to reach the servers. The event API's caching is also handled by NgRX.

## Heroku

The project is also deployed on Heroku. A few notes if you decide to check it out:

1. Heroku puts the servers to sleep after being idle for an hour, so you will most likely have to wait for them
   to wake up. Refreshing the page may be needed. The social feed and chat API-s, as well as the Prisma will start to wake up immediately, but the events and news
   servers only do so when you click on the relevant links.
2. One other thing Heroku does is to run out of memory with the Prisma API, sadly there is nothing I can do about that,
   restarting it manually solves the problem though. I am migrating everything to Azure Cloud soon. Please contact me before checking it out and I can make sure it will
   work as intended. :-)
3. You will see a blank page initially, because the feeds are only visible to friends. Feel free to tag me, I will
   accept it ASAP, then you will have access to my feed.
4. The page is using google authentication and is only asking for your basic profile info. I respect your privacy.   
4. By the way, here is the [link](https://mercury-nexus.herokuapp.com/).      
