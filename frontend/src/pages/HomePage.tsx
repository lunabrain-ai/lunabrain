import React, { useEffect } from 'react'

import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { getRefreshedToken } from '../utils/auth';
import {BookmarkSave} from "../components/BookmarkSave";
import {BookmarkList} from "../components/BookmarkList";

interface HomePageProps {}

export const HomePage: React.FunctionComponent<HomePageProps> = (props) => {
  const { hash } = useLocation();

  const params = new URLSearchParams(hash.replace('#', ''));
  const refreshToken = params.get('refreshToken')

  useEffect(() => {
    if (refreshToken) {
      getRefreshedToken(refreshToken);
    }
  }, [refreshToken])

  return (
    <Container>
      <BookmarkSave/>
      <BookmarkList/>
    </Container>
  );
}
