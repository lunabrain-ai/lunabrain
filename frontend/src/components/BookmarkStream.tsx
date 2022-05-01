import React from "react";
import {useGetBookmarksQuery} from "../generated/graphql";
import {Card, Col} from "react-bootstrap";

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
      <p>Error loading bookmarks: {error}</p>
    )
  }

  if (!data || data.bookmark.length === 0) {
    return (
      <p>No boomarks! Try adding some :)</p>
    )
  }

  const bookmarks = data.bookmark.map(bookmark => (
    <Col>
      <Card>
        <Card.Title>
        </Card.Title>
        <Card.Subtitle>
        </Card.Subtitle>
      </Card>
    </Col>
  ))

  return (
    <Container>
      <Row>

      </Row>
    </Container>
  )
}
