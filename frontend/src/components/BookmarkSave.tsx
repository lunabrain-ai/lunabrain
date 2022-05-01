import React, {useState} from "react";
import {useSaveBookmarksMutation} from "../generated/graphql";
import {Button, Form, FormGroup} from "react-bootstrap";
import {inputChangeHandler} from "../utils/hook-helpers";

interface BookmarkSaveProps {}

export const BookmarkSave: React.FunctionComponent<BookmarkSaveProps> = (props) => {
  const [saveBoomarksMutation, {data, loading, error}] = useSaveBookmarksMutation();

  const [url, setUrl] = useState<string | null>(null);

  const saveBookmark = async () => {
    const resp = await saveBoomarksMutation({
      variables: {
        bookmarks: [
          {
            url
          }
        ]
      }
    })
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    console.log(resp);
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
      </fieldset>
    </Form>
  )
}
