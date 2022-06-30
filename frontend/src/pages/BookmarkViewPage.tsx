import React from "react";
import {useGetBookmarkQuery} from "../generated/graphql";
import {Button, Container} from "react-bootstrap";
import ReactMarkdown from 'react-markdown'

interface BookmarkViewProps {
  match: {
    params: {
      id: string
    }
  }
}

export const BookmarkViewPage: React.FunctionComponent<BookmarkViewProps> = (props) => {
  const {data, error, loading} = useGetBookmarkQuery({
    variables: {
      id: props.match.params.id
    }
  });

  if (loading) {
    return (
      <p>Loading bookmark...</p>
    );
  }

  if (error || !data || !data.bookmark_by_pk) {
    return (
      <p>Error loading bookmark: {error}</p>
    );
  }

  const viewOriginal = () => {
    if (!data.bookmark_by_pk) {
      return;
    }
    window.location.href = data.bookmark_by_pk.url;
  }

  return (
    <Container>
      <h1>
        {data.bookmark_by_pk.title}
      </h1>
      <Button onClick={viewOriginal}>View original</Button>
      <ReactMarkdown children={data.bookmark_by_pk.content} />
    </Container>
  )
}
