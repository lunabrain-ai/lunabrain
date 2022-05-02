import React, { FunctionComponent, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Link, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Container, Nav } from 'react-bootstrap';
import RecoilizeDebugger from 'recoilize';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'src/styles/main.css';

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
    <ApolloProvider client={client}>
      <Router>
        <Container>
          <Nav className="justify-content-center" activeKey="/">
            <Nav.Item>
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <RecoilRoot>
          <RecoilizeDebugger />
          <Suspense fallback={<span>Loading...</span>}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/login" component={LoginPage} />
            </Switch>
          </Suspense>
        </RecoilRoot>
      </Router>
    </ApolloProvider>
  )
}
