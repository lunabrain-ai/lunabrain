import os
import re

from slugify import slugify

if os.environ.get("LUNABRAIN_DIR") is None:
    raise Exception("LUNABRAIN_DIR must be set")


def make_if_not_exist(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)


index_filename = "index.json"
index_dir = os.path.join(os.environ.get("LUNABRAIN_DIR"), "index")
make_if_not_exist(index_dir)


def get_content_index_dir(index_path, content_dir):
    slug = slugify(content_dir)
    content_index_dir = os.path.join(index_path, slug)
    return slug, content_index_dir


def new_index_file(index_path, content_dir, indx_filename=index_filename):
    slug, content_index_dir = get_content_index_dir(index_path, content_dir)
    return slug, os.path.join(content_index_dir, indx_filename)


def load_indexes(index_type_dir):
    make_if_not_exist(index_type_dir)

    print(f"Loading indexes from {index_type_dir}...")
    index_lookup = {}
    for file in os.listdir(index_type_dir):
        indx = os.path.join(index_type_dir, file, index_filename)
        exists = os.path.exists(indx)
        if exists:
            print(f"Found index {file}")
            index_lookup[file] = indx
    return index_lookup


def split_into_paragraphs(text, minimum_length=256):
    """
    split into paragraphs and batch small paragraphs together into the same paragraph
    """
    if text is None:
        return []
    paragraphs = []
    current_paragraph = ''
    for paragraph in re.split(r'\n\s*\n', text):
        if len(current_paragraph) > 0:
            current_paragraph += ' '
        current_paragraph += paragraph.strip()

        if len(current_paragraph) > minimum_length:
            paragraphs.append(current_paragraph)
            current_paragraph = ''

    if len(current_paragraph) > 0:
        paragraphs.append(current_paragraph)

    return paragraphs
