import React, {useEffect, useState} from 'react'

import { useLocation } from 'react-router-dom';
import {Button, Container, Form, FormGroup} from 'react-bootstrap';
import { getRefreshedToken } from '../utils/auth';
import {BookmarkSave} from "../components/BookmarkSave";
import {BookmarkList} from "../components/BookmarkList";
import {inputChangeHandler} from "../utils/hook-helpers";
import {useNewPileMutation, useSaveBookmarkByUrlMutation} from "../generated/graphql";

interface PilesPageProps {}

export const PilesPage: React.FunctionComponent<PilesPageProps> = (props) => {
  const [saveBoomarkByUrlMutation, {data, loading, error}] = useNewPileMutation();

  const [url, setUrl] = useState<string | null>(null);

  const saveBookmark = async () => {
    if (url === null) {
      return;
    }

    // try {
    //   const resp = await saveBoomarkByUrlMutation({
    //     variables: {
    //       url,
    //     }
    //   });
    // } catch (e) {
    //   console.error(e);
    // }
  }
  return (
    <Container>
      <h1>Piles</h1>
      <p>Organized piles of bookmarks</p>
    </Container>
  );
}
