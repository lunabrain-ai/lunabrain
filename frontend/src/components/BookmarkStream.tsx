import React from "react";
import {useGetBookmarksQuery} from "../generated/graphql";
import {Card, Col, Container, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

interface BookmarkStreamProps {}

export const BookmarkStream: React.FunctionComponent<BookmarkStreamProps> = (props) => {
  const history = useHistory();

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

  if (!data || data.bookmarks.length === 0) {
    return (
      <p>No boomarks! Try adding some :)</p>
    )
  }

  const bookmarks = data.bookmarks.map(bookmark => (
    <Col
      sm
      className='my-2'
      key={bookmark.id}
    >
      <Card
        style={{ width: '18rem', height: '100%' }}
        onClick={() => {
          history.push(`/view/${bookmark.id}`)
        }}
      >
        <Card.Title>
          {bookmark.title}
        </Card.Title>
        <Card.Subtitle>
          {bookmark.url}
        </Card.Subtitle>
        <Card.Body>
          {bookmark.excerpt}
        </Card.Body>
      </Card>
    </Col>
  ))

  return (
    <Container>
      <Row>
        {bookmarks}
      </Row>
    </Container>
  )
}
