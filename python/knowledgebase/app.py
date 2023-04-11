import streamlit as st
import streamlit.components.v1 as components
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import utils
from kb import KB

texts = {
    "Napoleon": "Napoleon Bonaparte (born Napoleone di Buonaparte; 15 August 1769 – 5 May 1821), and later known by his regnal name Napoleon I, was a French military and political leader who rose to prominence during the French Revolution and led several successful campaigns during the Revolutionary Wars. He was the de facto leader of the French Republic as First Consul from 1799 to 1804. As Napoleon I, he was Emperor of the French from 1804 until 1814 and again in 1815. Napoleon's political and cultural legacy has endured, and he has been one of the most celebrated and controversial leaders in world history.",
    "Kobe Bryant": "Kobe Bean Bryant (August 23, 1978 – January 26, 2020) was an American professional basketball player. A shooting guard, he spent his entire 20-year career with the Los Angeles Lakers in the National Basketball Association (NBA). Widely regarded as one of the greatest basketball players of all time, Bryant won five NBA championships, was an 18-time All-Star, a 15-time member of the All-NBA Team, a 12-time member of the All-Defensive Team, the 2008 NBA Most Valuable Player (MVP), and a two-time NBA Finals MVP. Bryant also led the NBA in scoring twice, and ranks fourth in league all-time regular season and postseason scoring. He was posthumously voted into the Naismith Memorial Basketball Hall of Fame in 2020 and named to the NBA 75th Anniversary Team in 2021.",
    "Google": "Originally known as BackRub. Google is a search engine that started development in 1996 by Sergey Brin and Larry Page as a research project at Stanford University to find files on the Internet. Larry and Sergey later decided the name of their search engine needed to change and chose Google, which is inspired from the term googol. The company is headquartered in Mountain View, California."
}

urls = {
    "Crypto": "https://www.investopedia.com/terms/c/cryptocurrency.asp",
    "Jhonny Depp": "https://www.britannica.com/biography/Johnny-Depp",
    "Rome": "https://www.timeout.com/rome/things-to-do/best-things-to-do-in-rome"
}

st.header("Extracting a Knowledge Base from text")

# sidebar
with st.sidebar:
    st.markdown("_Read the accompanying article [Building a Knowledge Base from Texts: a Full Practical Example](https://medium.com/nlplanet/building-a-knowledge-base-from-texts-a-full-practical-example-8dbbffb912fa)_")
    st.header("What is a Knowledge Base")
    st.markdown("A [**Knowledge Base (KB)**](https://en.wikipedia.org/wiki/Knowledge_base) is information stored in structured data, ready to be used for analysis or inference. Usually a KB is stored as a graph (i.e. a [**Knowledge Graph**](https://www.ibm.com/cloud/learn/knowledge-graph)), where nodes are **entities** and edges are **relations** between entities.")
    st.markdown("_For example, from the text \"Fabio lives in Italy\" we can extract the relation triplet <Fabio, lives in, Italy>, where \"Fabio\" and \"Italy\" are entities._")
    st.header("How to build a Knowledge Graph")
    st.markdown("To build a Knowledge Graph from text, we typically need to perform two steps:\n- Extract entities, a.k.a. **Named Entity Recognition (NER)**, i.e. the nodes.\n- Extract relations between the entities, a.k.a. **Relation Classification (RC)**, i.e. the edges.\nRecently, end-to-end approaches have been proposed to tackle both tasks simultaneously. This task is usually referred to as **Relation Extraction (RE)**. In this demo, an end-to-end model called [**REBEL**](https://github.com/Babelscape/rebel/blob/main/docs/EMNLP_2021_REBEL__Camera_Ready_.pdf) is used, trained by [Babelscape](https://babelscape.com/).")
    st.header("How REBEL works")
    st.markdown("REBEL is a **text2text** model obtained by fine-tuning [**BART**](https://huggingface.co/docs/transformers/model_doc/bart) for translating a raw input sentence containing entities and implicit relations into a set of triplets that explicitly refer to those relations. You can find [REBEL in the Hugging Face Hub](https://huggingface.co/Babelscape/rebel-large).")
    st.header("Further steps")
    st.markdown("Even though they are not visualized, the knowledge graph saves information about the provenience of each relation (e.g. from which articles it has been extracted and other metadata), along with Wikipedia data about each entity.")
    st.markdown("Other libraries used:\n- [wikipedia](https://pypi.org/project/wikipedia/): For validating extracted entities checking if they have a corresponding Wikipedia page.\n- [newspaper](https://github.com/codelucas/newspaper): For parsing articles from URLs.\n- [pyvis](https://pyvis.readthedocs.io/en/latest/index.html): For graphs visualizations.\n- [GoogleNews](https://github.com/Iceloof/GoogleNews): For reading Google News latest articles about a topic.")
    st.header("Considerations")
    st.markdown("If you look closely at the extracted knowledge graphs, some extracted relations are false. Indeed, relation extraction models are still far from perfect and require further steps in the pipeline to build reliable knowledge graphs. Consider this demo as a starting step!")

# Loading the model
st_model_load = st.text('Loading NER model... It may take a while.')

@st.cache(allow_output_mutation=True)
def load_model():
    print("Loading model...")
    tokenizer = AutoTokenizer.from_pretrained("Babelscape/rebel-large")
    model = AutoModelForSeq2SeqLM.from_pretrained("Babelscape/rebel-large")
    print("Model loaded!")
    return tokenizer, model

tokenizer, model = load_model()
st.success('Model loaded!')
st_model_load.text("")

# Choose from where to generate the KB
options = [
    "Text",
    "Article at URL",
    "Multiple news articles"
]
if 'option' not in st.session_state:
    st.session_state.option = options[0]
option = st.selectbox('Build a Knowledge Base from:', options, index=options.index(st.session_state.option))

text_option, text = None, None
url_option, url = None, None
news_option = None

if option == "Text":
    text_options = [
        "Napoleon",
        "Kobe Bryant",
        "Google",
        "Free text"
    ]
    if 'text_option' not in st.session_state or st.session_state.text_option is None:
        st.session_state.text_option = text_options[0]
    text_option = st.selectbox('Choose text option:', text_options, index=text_options.index(st.session_state.text_option))

    disabled = False
    if text_option != "Free text":
        disabled = True
        text = texts[text_option]
    else:
        if 'text' not in st.session_state:
            st.session_state.text = ""
        text = st.session_state.text
    text = st.text_area('Text:', value=text, height=300, disabled=disabled, max_chars=10000)
elif option == "Article at URL":
    url_options = [
        "Crypto",
        "Jhonny Depp",
        "Rome",
        "Free URL"
    ]
    if 'url_option' not in st.session_state or st.session_state.url_option is None:
        st.session_state.url_option = url_options[0]
    url_option = st.selectbox('Choose URL option:', url_options, index=url_options.index(st.session_state.url_option))

    disabled = False
    if url_option != "Free URL":
        disabled = True
        url = urls[url_option]
    else:
        if 'url' not in st.session_state:
            st.session_state.url = ""
        url = st.session_state.url
    url = st.text_input('URL:', value=url, disabled=disabled)
else:
    news_options = [
        "Google",
        "Apple",
        "Elon Musk",
        "Kobe Bryant"
    ]
    if 'news_option' not in st.session_state or st.session_state.news_option is None:
        st.session_state.news_option = news_options[0]
    news_option = st.selectbox('Use articles about:', news_options, index=news_options.index(st.session_state.news_option))

def generate_kb():
    st.session_state.option = option
    st.session_state.text_option = text_option
    st.session_state.text = text
    st.session_state.url_option = url_option
    st.session_state.url = url
    st.session_state.news_option = news_option

    # load correct kb
    if option == "Text":
        if text_option == "Napoleon":
            kb = utils.load_kb("networks/network_1_napoleon.p")
        elif text_option == "Kobe Bryant":
            kb = utils.load_kb("networks/network_1_bryant.p")
        elif text_option == "Google":
            kb = utils.load_kb("networks/network_1_google.p")
        else:
            kb = utils.from_text_to_kb(text, model, tokenizer, "", verbose=True)
    elif option == "Article at URL":
        if url_option == "Crypto":
            kb = utils.load_kb("networks/network_2_crypto.p")
        elif url_option == "Jhonny Depp":
            kb = utils.load_kb("networks/network_2_depp.p")
        elif url_option == "Rome":
            kb = utils.load_kb("networks/network_2_rome.p")
        else:
            try:
                kb = utils.from_url_to_kb(url, model, tokenizer)
            except Exception as e:
                print("Couldn't extract article from URL")
                st.session_state.error_url = "Couldn't extract article from URL"
                return
    else:
        if news_option == "Google":
            kb = utils.load_kb("networks/network_3_google.p")
        elif news_option == "Apple":
            kb = utils.load_kb("networks/network_3_apple.p")
        elif news_option == "Elon Musk":
            kb = utils.load_kb("networks/network_3_musk.p")
        elif news_option == "Kobe Bryant":
            kb = utils.load_kb("networks/network_3_bryant.p")

    # save chart
    utils.save_network_html(kb, filename="networks/network.html")
    st.session_state.kb_chart = "networks/network.html"
    st.session_state.kb_text = kb.get_textual_representation()
    st.session_state.error_url = None


st.session_state.option = option
st.session_state.text_option = text_option
st.session_state.text = text
st.session_state.url_option = url_option
st.session_state.url = url
st.session_state.news_option = news_option

button_text = "Show KB"
if (option == "Text" and text_option == "Free text") or (option == "Article at URL" and url_option == "Free URL"):
    button_text = "Generate KB"

# generate KB button
st.button(button_text, on_click=generate_kb)

# kb chart session state
if 'kb_chart' not in st.session_state:
    st.session_state.kb_chart = None
if 'kb_text' not in st.session_state:
    st.session_state.kb_text = None
if 'error_url' not in st.session_state:
    st.session_state.error_url = None

# show graph
if st.session_state.error_url:
    st.markdown(st.session_state.error_url)
elif st.session_state.kb_chart:
    with st.container():
        st.subheader("Generated KB")
        st.markdown("*You can interact with the graph and zoom.*")
        html_source_code = open(st.session_state.kb_chart, 'r', encoding='utf-8').read()
        components.html(html_source_code, width=700, height=700)
        st.markdown(st.session_state.kb_text)