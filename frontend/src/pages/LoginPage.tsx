import React, { useState } from 'react'

import { useHistory } from 'react-router-dom';
import { inputChangeHandler } from '../utils/hook-helpers';
import { authUrl } from 'src/utils/auth';
import {Button, Container, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";

interface LoginPageProps {

}

export const LoginPage: React.FunctionComponent<LoginPageProps> = (props) => {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const resp = await fetch(`${authUrl}/signin/email-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'email': email,
        'password': password
      })
    })

    if (!resp.ok) {
      throw new Error('login did no succeed');
    }

    const data = await resp.json() as {session: {accessToken: string, user: {email: string}}}
    localStorage.setItem('token', data.session.accessToken);
    localStorage.setItem('loginType', 'email-password');
    history.push('/')
  }

  const loginWithGoogle = () => {
    window.location.href = `${authUrl}/signin/provider/google?redirectTo=${process.env.AUTH_REDIRECT}`;
  }

  return (
    <Container>
      <Row>
        <div>
          <FormGroup controlId="email">
              <FormLabel>Email</FormLabel>
              <FormControl type="text" name="email" placeholder="Enter your email" onChange={inputChangeHandler(setEmail)} />
          </FormGroup>
          <FormGroup controlId="password">
              <FormLabel>Password</FormLabel>
              <FormControl type="password" name="password" placeholder="Enter your password" onChange={inputChangeHandler(setPassword)} />
          </FormGroup>
          <Button onClick={login} type="submit">Sign-In</Button>
          <Button onClick={loginWithGoogle} type="submit">Sign-In with Google</Button>
        </div>
      </Row>
    </Container>
  );
}
