---
title: "OpenAI Vendor Lock-in: The Ironic Story of How OpenAI Went from Open SourcePage to \"Open Your Wallet\""
description: "diving into the complicated past of openAI and their relationship with open source software"
slug: openai-not-so-open
date: 2023-03-24T07:00:00.000Z
categories: [openai, closed-source,open-source]
tags: [openai]
contributors: ["forrest"]
draft: false
weight: 50
images: [wallet-cover.png]
pinned: false
homepage: false
---

<!--
  ~ Copyright by LunaSec (owned by Refinery Labs, Inc)
  ~
  ~ Licensed under the Creative Commons Attribution-ShareAlike 4.0 International
  ~ (the "License"); you may not use this file except in compliance with the
  ~ License. You may obtain a copy of the License at
  ~
  ~ https://creativecommons.org/licenses/by-sa/4.0/legalcode
  ~
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  ~
-->

I can't take full credit for the title. This sentiment is all over the open source community.


OpenAI, once a beacon of hope for the open-source community, has evolved into a closed-source, profit-driven behemoth,
leaving many to question its trustworthiness. Despite this transformation, LunaSec has been making great use of their
products, including the recent release of ChatGPT, which has ignited a chatbot arms race among tech giants. However, due
to OpenAI's departure from its original vision and the influence of multi-billion-dollar deals like Microsoft's massive
investment, we hope to eventually transition to an open-source alternative.

## The Transformation of OpenAI
In the beginning, OpenAI was established as a nonprofit research organization committed to advancing digital
intelligence for the benefit of humanity. The founding members, including Sam Altman, Elon Musk, and Peter Thiel,
promised to focus on positive human impact and transparency. Researchers were encouraged to share their findings,
code, and patents with the world.

Fast-forward to today, and OpenAI has pivoted to a profit-driven model. Critics, including co-founder Musk,
argue that the company is now focused on speed and profit instead of positive human impact.

## Elon Musk's Worst Nightmare: Close SourcePage, Corporate Control of AI
Musk has long considered AI to be "fundamental existential risk for human civilization". He has spent years
calling for strict government regulation and caution around AI research, and received some interest from regulators.
One of Musk's main suggestions was to [learn as much as possible](https://www.theguardian.com/technology/2017/jul/17/elon-musk-regulation-ai-combat-existential-threat-tesla-spacex-ceo) to better understand the
problem.

<blockquote class="twitter-tweet" data-conversation="none">
    <p lang="en" dir="ltr">OpenAI was created as an open source (which is why I named it “Open” AI), non-profit
        company to serve as a counterweight to Google, but now it has become a closed source, maximum-profit company effectively controlled by Microsoft. Not what I intended at all.</p>&mdash; Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1626516035863212034?ref_src=twsrc%5Etfw">February 17, 2023</a></blockquote>


Originally, when he co-founded OpenAI, Musk envisioned it as a nonprofit organization that would share its
research and technology. Musk lost any hope of control over the company in 2018, however, in a power struggle driven
largely by OpenAI's pivot to a for-profit model. OpenAI became increasingly entangled with
Microsoft and other corporate partners, trading transparency and openness for financial resources.


## Vendor lock is really inconvenient
Mission statements and ideologies aside, there are a lot of day-to-day struggles with using something controlled by
just one company.

### API Outages, Reliability Issues, and Unannounced Changes
OpenAI's ChatGPT has experienced several API outages and reliability issues, leaving developers and businesses
in the lurch.
Furthermore, subtle changes to models behind the scenes have the potential to break existing use cases without
warning. Put simply, developers do not have control of a huge and often critical component of their own software.

### Inability to Train Additional Data
The inability to train additional data into ChatGPT limits developers and businesses from customizing the AI to their
specific needs. There are a thousand companies out there that would love to train an LLM as powerful as ChatGPT on
their own data sets, us included. The fine-tuning API that OpenAI does offer isn't well suited to additional
pre-training. This means that what the model "knows" about is up to OpenAI.

This stifles innovation and increases dependence on OpenAI's proprietary technology.

## Alternatives: A Glimmer of Hope
In spite of the concerns surrounding OpenAI, there are alternatives.  If you're curious to see what more open competitors are like,
trying them out isn't as difficult as you might think.
:::note
These next two models have restrictive, non-commercial licenses.
:::

### [Llama](https://ai.facebook.com/blog/large-language-model-llama-meta-ai/)
Facebook's Llama model is available for research purposes but cannot be used commercially. It offers a step
forward but is not enough for those seeking to harness the LLM revolution for business reasons. You can try Facebook's
LLama on your powerful computer by firing up [this easy to use javascript GUI](https://github.com/mpociot/llamero), although I'd recommend you have fast internet, plenty
of disk space, and a top of the line machine.

### [ChatGLM](https://github.com/THUDM/ChatGLM-6B/blob/main/README_en.md)
Another non-commercial LLM, ChatGLM, is even easier to try.
You can [launch ChatGLM](https://colab.research.google.com/github/MarkSchmidty/ChatGLM-6B-Int4-Web-Demo/blob/main/ChatGLM-6B_int4_Web_Demo.ipynb#scrollTo=hS3OPJza5Eo4) for free on Google
Colab with just one click. With far fewer neurons than ChatGPT, a smaller training
dataset, and presumably less advanced technology, it falls noticeably short, at least in English.

### [Open SourcePage Alternatives](https://github.com/nichtdax/awesome-totally-open-chatgpt)
Open-source alternatives: The open-source community is working on alternatives to ChatGPT, like the ones listed on this
[awesome totally open chatgpt](https://github.com/nichtdax/awesome-totally-open-chatgpt) list.
As shown by the categories in the list, some of these models can be trained, customized, and self-hosted, with
permissive licenses that allow for more control and customization without vendor lock-in.



## Conclusion
OpenAI's transformation from an open-source champion to a closed-source, profit-driven company is a cautionary tale
for the AI industry. Although the company has made significant strides in AI development, its increasing secrecy,
lack of transparency, and limited customization options have alienated the very community it once aimed to serve.
The future of AI depends on stakeholders, including researchers, developers, and businesses, actively working to
prevent monopolization and ensure transparency, openness, and collaboration remain at the forefront of AI development.
