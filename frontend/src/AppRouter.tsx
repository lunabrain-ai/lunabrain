import React, { FunctionComponent, Suspense } from 'react'
import { BrowserRouter as Router, Link, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import {ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {Container, Nav, Navbar} from 'react-bootstrap';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { Provider as StoreProvider } from 'react-redux';

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'src/styles/main.css';
import {BookmarkViewPage} from "./pages/BookmarkViewPage";
import {store} from "./store/store";
import {onError} from "@apollo/client/link/error";
import useAppSelector from "./hooks/useAppSelector";
import {selectSession} from "./store/slices/authentication";
import {LoadSession} from "./components/auth/LoadSession";

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
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ response, graphQLErrors, networkError }) => {
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
    }),
    authLink,
    httpLink,
  ])
});

const AppNav: React.FunctionComponent = () => {
  const session = useAppSelector(selectSession);
  console.log(session)
  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="#home">Sifty</Navbar.Brand>
        <Nav className="me-auto" activeKey="/">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>Signed in as: {session?.identity.traits.email}</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export const AppRouter: FunctionComponent = () => {
  return (
    <Router>
      <Suspense fallback={<span>Loading...</span>}>
        <StoreProvider store={store}>
          <LoadSession>
            <ApolloProvider client={client}>
              <AppNav />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/view/:id" component={BookmarkViewPage} />
              </Switch>
            </ApolloProvider>
          </LoadSession>
        </StoreProvider>
      </Suspense>
    </Router>
  )
}
