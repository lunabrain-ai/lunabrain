import React, { FunctionComponent, Suspense } from 'react'
import { BrowserRouter as Router, Link, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import {ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {Button, Container, Nav, Navbar} from 'react-bootstrap';
import { HomePage } from './pages/HomePage';
import { Provider as StoreProvider } from 'react-redux';

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'src/styles/main.css';
import {BookmarkViewPage} from "./pages/BookmarkViewPage";
import {store} from "./store/store";
import {onError} from "@apollo/client/link/error";
import useAppSelector from "./hooks/useAppSelector";
import {logout, selectSession} from "./store/slices/authentication";
import {LoadSession} from "./components/auth/LoadSession";
import {Login} from "./components/auth/Login";
import useAppDispatch from "./hooks/useAppDispatch";
import {PilesPage} from "./pages/PilesPage";
import {PileViewPage} from "./pages/PileViewPage";

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
  const history = useHistory();
  const dispatch = useAppDispatch();
  const doLogout = () => void dispatch(logout(history));

  const sessionInformation = session ?
    <>{`Logged in as: ${session.identity.traits.email}`} <Button onClick={doLogout}>Log Out</Button></> :
    <Login />;

  return (
    <Navbar>
      <Container>
        <Navbar.Brand href="/">Sifty</Navbar.Brand>
        <Nav className="me-auto" activeKey="/">
          <Nav.Link href="/">Home</Nav.Link>
        </Nav>
        <Nav className="me-auto">
          <Nav.Link href="/pile">Piles</Nav.Link>
        </Nav>
        <Nav className="me-auto">
          <Nav.Link href="/consumer">Consumers</Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>{sessionInformation}</Navbar.Text>
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
                <Route path="/pile" component={PilesPage} />
                <Route path="/pile/:id" component={PileViewPage} />
                <Route path="/consumer" component={PilesPage} />
                <Route path="/bookmark/:id" component={BookmarkViewPage} />
              </Switch>
            </ApolloProvider>
          </LoadSession>
        </StoreProvider>
      </Suspense>
    </Router>
  )
}
