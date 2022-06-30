import React from 'react'

import { Container } from 'react-bootstrap';

interface PileViewPageProps {
  match: {
    params: {
      id: string
    }
  }
}

export const PileViewPage: React.FunctionComponent<PileViewPageProps> = (props) => {
  return (
    <Container>
    </Container>
  );
}
