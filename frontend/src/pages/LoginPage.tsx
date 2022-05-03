import React, { useState } from 'react'

import {Button, Container, FormControl, FormGroup, FormLabel, Row} from "react-bootstrap";
import {Login} from "../components/auth/Login";

interface LoginPageProps {

}

export const LoginPage: React.FunctionComponent<LoginPageProps> = (props) => {
  return (
    <Container>
      <Row>
        <p>asdf</p>
        <Login />
      </Row>
    </Container>
  );
}
