import React, {useState} from "react";
import {useSaveBookmarkByUrlMutation} from "../generated/graphql";
import {Button, Form, FormGroup} from "react-bootstrap";
import {inputChangeHandler} from "../utils/hook-helpers";

interface BookmarkSaveProps {}

export const BookmarkSave: React.FunctionComponent<BookmarkSaveProps> = (props) => {
  const [saveBoomarkByUrlMutation, {data, loading, error}] = useSaveBookmarkByUrlMutation();

  const [url, setUrl] = useState<string | null>(null);

  const saveBookmark = () => {
    if (url === null) {
      return;
    }

    void saveBoomarkByUrlMutation({
      variables: {
        url,
      }
    })
  }

  return (
    <Form>
      <fieldset disabled={loading}>
        <FormGroup>
          <Form.Label>Bookmark Url</Form.Label>
          <Form.Control type='text' placeholder='Url' onChange={inputChangeHandler(setUrl)}/>
        </FormGroup>
        <Button type='submit' onClick={saveBookmark}>
          Submit
        </Button>
        {error && (
          <p>Error while saving bookmark: {error.graphQLErrors.map(e => e.message)}</p>
        )}
      </fieldset>
    </Form>
  )
}
