from haystack.pipelines import Pipeline
from haystack.nodes import Crawler, PreProcessor, BM25Retriever, FARMReader
from haystack.document_stores import FAISSDocumentStore

document_store = FAISSDocumentStore()

# Create the document store. You need it to:
#  1. Store the documents you crawled and preprocessed (with an indexing pipeline).
#  2. Extract the documents that contain the answer to your question (with a query pipeline).
#     document_store = ElasticsearchDocumentStore(host="localhost", username="", password="", index="document")


#
# Step 1: Get the data, clean it, and store it.
#

# NOTE: Run this code just once, every time you create a new Elasticsearch container. Comment it out afterwards.

# Let's create the indexing pipeline. It will contain:
#  1. A Crawler node that fetches text from a website.
#  2. A PreProcessor that makes the documents friendly to the Retriever.
#  3. The DocumentStore that receives the documents and stores them.

crawler = Crawler(
    urls=["https://haystack.deepset.ai"],   # Websites to crawl
    crawler_depth=1,    # How many links to follow
    output_dir="crawled_files",  # The directory to store the crawled files, not very important, we don't use the files in this example
)
preprocessor = PreProcessor(
    clean_empty_lines=True,
    clean_whitespace=True,
    clean_header_footer=False,
    split_by="word",
    split_length=500,
    split_respect_sentence_boundary=True,
)
indexing_pipeline = Pipeline()
indexing_pipeline.add_node(component=crawler, name="crawler", inputs=['File'])
indexing_pipeline.add_node(component=preprocessor, name="preprocessor", inputs=['crawler'])
indexing_pipeline.add_node(component=document_store, name="document_store", inputs=['preprocessor'])

indexing_pipeline.run(params={"crawler": {'return_documents': True}})


#
# Step 2: Use the data to answer questions.
#

# NOTE: You can run this code as many times as you like.

# Let's create a query pipeline. It will contain:
#  1. A Retriever that gets the relevant documents from the DocumentStore.
#  2. A Reader that locates the answers inside the documents.
retriever = BM25Retriever(document_store=document_store)
reader =  FARMReader(model_name_or_path="deepset/roberta-base-squad2-distilled")

query_pipeline = Pipeline()
query_pipeline.add_node(component=retriever, name="retriever", inputs=["Query"])
query_pipeline.add_node(component=reader, name="reader", inputs=["retriever"])

results = query_pipeline.run(query="What can I use Haystack for?")

print("\nQuestion: ", results["query"])
print("\nAnswers:")
for answer in results["answers"]:
    print("- ", answer.answer)
print("\n\n")
