import React from "react";
import {useGetBookmarksQuery} from "../generated/graphql";
import {Card, Col, Container, Row} from "react-bootstrap";

interface BookmarkStreamProps {}

export const BookmarkStream: React.FunctionComponent<BookmarkStreamProps> = (props) => {
  const {data, error, loading} = useGetBookmarksQuery();

  if (loading) {
    return (
      <p>Loading bookmarks...</p>
    )
  }

  if (error) {
    return (
      <p>Error loading bookmarks: {error.graphQLErrors.map(e => e.message)}</p>
    )
  }

  if (!data || data.bookmark.length === 0) {
    return (
      <p>No boomarks! Try adding some :)</p>
    )
  }

  const bookmarks = data.bookmark.map(bookmark => (
    <div key={bookmark.id}>
      <Col>
        <Card>
          <Card.Title>
            {bookmark.title}
          </Card.Title>
          <Card.Subtitle>
            {bookmark.url}
          </Card.Subtitle>
        </Card>
      </Col>
    </div>
  ))

  return (
    <Container>
      <Row>
        {bookmarks}
      </Row>
    </Container>
  )
}
