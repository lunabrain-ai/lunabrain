import React, { FunctionComponent, Suspense } from 'react'
import { BrowserRouter as Router, Link, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Container, Nav } from 'react-bootstrap';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Provider as StoreProvider } from 'react-redux';

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'src/styles/main.css';
import {BookmarkViewPage} from "./pages/BookmarkViewPage";
import {store} from "./store/store";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const AppRouter: FunctionComponent = () => {
  return (
    <Router>
      <Container>
        <Nav className="justify-content-center" activeKey="/">
          <Nav.Item>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
      <Suspense fallback={<span>Loading...</span>}>
        <StoreProvider store={store}>
          <ApolloProvider client={client}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/view/:id" component={BookmarkViewPage} />
            </Switch>
          </ApolloProvider>
        </StoreProvider>
      </Suspense>
    </Router>
  )
}
