# Mercury App

Mercuy is a social media app using Angular 6 and 4 + 1 microservices with multiple backend technologies, 
including my own Java microframework, Spring, NodeJS, GraphQL and Websockets. I have recently switched out
the event API and chat API, you can find the details and the legacy repos below.

1. [Social Feed](https://github.com/DanielCs1988/mercury-feed-api)
2. [Chat](https://github.com/DanielCs1988/mercury-chat-node)
3. [Events](https://github.com/DanielCs1988/mercury-events-java)
4. [News](https://github.com/DanielCs1988/mercury-news-api)

+1: The Prisma API, more information below (there is no repository I can expose).

Legacy repos:
1. [Events](https://github.com/DanielCs1988/mercury-events-api): used Node Express before, switched to my own Java microframework.
2. [Chat](https://github.com/DanielCs1988/mercury-chat-api): used my homegrown Java WebSocket server before, switched to Node Express and socket.io.

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
 Every social feed related operation, including posts, comments, likes,
user profiles and friendships are located here. Users are only allowed access to specific entries based on their user credentials and friends.

## Events API

The events API is an HTTP server using pure Java and [my own microframework](https://github.com/DanielCs1988/webserver-pack). The framework wraps around the basic built-in HttpServer
implementation and provides route configuration via annotations, similarly to Spring. It is also a full-fledged IoC
container exposing features such as dependency injection, aspect weaving, middlewares for HTTP and WebSocket connections, and HTTP request utility classes generated runtime
like Spring does with interfaces extending the JpaRepository. It also implements a WebSocket server built from the ground-up (the Java Socket and ServerSocket classes), with the same features as the HTTP server.

Instead of an ORM, the API is using DAO classes and a generic SQL helper service with raw JDBC, backed by PostgreSQL.
 
## Chat API

A Node Express server written in Typescript, using [socket.io](https://socket.io/) to handle the WebSocket connections. Persistence is provided by MongoDB via the
Mongoose ORM.

## News API

The news API fetches and provides news and weather information
based on (geo)location and custom filters. It is written in Spring and I am planning to extend it with a feature
that will allow public personas to register and publish posts. Normal users will then be able to subscribe to those
personas and get updates from them.

## Authentication and User profiles

Using the popular OAuth method, the login button redirects the user to the [Auth0](https://auth0.com/) page where they can log in via
their google account. An RS256 encoded JWT token is issued then and used throughout the microservices,
providing common ground for authentication and authorization. What's more, profile data is fetched directly from google,
providing a personal experience from the get-go.

## The Angular App

All these microservices are connected in the Angular 6 SPA, which is hosted on Google Firebase. The feed API is the special case here, because it uses the
GraphQL specification instead of REST, so I have chosen to work with the new [Apollo 2](https://www.apollographql.com/)
client, also employed by New York Times. This library is integrated into Angular, and is using the Angular 6 HttpClient internally. Caching is
handled by a datastore similar to Redux. The connection itself is split between regular HTTP for queries and mutations,
and WebSocket for subscriptions. Both the datastore and the server can be accessed using the unique GQL query language,
allowing users to fetch complex data in a simple and clean way, without overfetching or having to hit multiple endpoints.

The chat API is connected through the socket.io client, using [RxJS](https://rxjs-dev.firebaseapp.com/) to
wrap socket communications in observables. Caching is handled by [NgRX](https://github.com/ngrx/platform), an Angular implementation of the Redux pattern.

The news and the events APIs are using Angular's own HttpClient to reach the servers. The event API's caching is also handled by NgRX.

## Heroku

The project is also deployed on Heroku. A few notes if you decide to check it out:

1. Heroku puts the servers to sleep after being idle for an hour, so you will most likely have to wait a couple of seconds for them
   to wake up. Refreshing the page may be needed. The social feed and chat API-s, as well as the Prisma will start to wake up immediately, but the events and news
   servers only do so when you click on the relevant links.
2. You will see a blank page initially, because the feeds are only visible to friends. Feel free to tag me, I will
   accept it ASAP, then you will have access to my feed.
3. The page is using google authentication and is only asking for your basic profile info. I respect your privacy.   
4. By the way, here is the [link](https://mercury-nexus.firebaseapp.com).      
