import { NgModule } from '@angular/core';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {WebSocketLink} from 'apollo-link-ws';
import {getMainDefinition} from 'apollo-utilities';
import { split } from 'apollo-link';
import {HttpClientModule} from '@angular/common/http';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {Endpoints} from './utils/endpoints';

export function createApollo(httpLink: HttpLink) {
    const http = httpLink.create({ uri: Endpoints.FEED_HTTP });
    const ws = new WebSocketLink({
        uri: Endpoints.FEED_WS,
        options: {
            reconnect: true
        }
    });

    const link = split(({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    }, ws, http);

    return {
        link: link,
        cache: new InMemoryCache()
    };
}

@NgModule({
    imports: [
        HttpClientModule,
        ApolloModule,
        HttpLinkModule
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        }
    ]
})
export class AppApolloModule { }
