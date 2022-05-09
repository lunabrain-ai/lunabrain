import React from "react";
import {useGetBookmarkQuery} from "../generated/graphql";
import {Container} from "react-bootstrap";
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

  if (error || !data || !data.bookmarks_by_pk) {
    return (
      <p>Error loading bookmark: {error}</p>
    );
  }

  return (
    <Container>
      <h1>
        {data.bookmarks_by_pk.title}
      </h1>
      <ReactMarkdown children={data.bookmarks_by_pk.content} />
    </Container>
  )
}
