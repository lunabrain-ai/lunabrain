# Sifty

**S**tore **I**nformation, **F**ilter **T**ext **Y**ourself (work in progress acronym)

Inspired by Shiori

A **source** represents some external source of data that is of interest (ex. blog, subreddit, youtube channel, etc.).
A **bookmark** is a specific reference to data from a **source** identified by a URL.
A **pile** is a collection of unique bookmarks.
All **bookmarks** that are created by a user end up in their account's **pile**.
In the future: A **pile** will have reference to all historic **bookmarks** whose details have been overridden by changes
during the upsert. A **pile bookmark** is traceable back to the originating **source**.
A **processor** can process a **source**, **bookmark**, or a **pile** and directs **bookmarks** to other piles.
A **processor** can be configured to run on a schedule or based on a remote push event (ie. webhook).
A **subscriber** can subscribe to a **pile** and perform some action on a newly added **bookmark**.
The combination of a **processor** and **subscriber** working on **piles** is externally referred to as a **sifter** (ie.
"You create a _sifter_ to go through your piles of bookmarks").

Example:
A user is browsing the Internet and finds an article that is of interest. The user uses the Sifty extension to save a
**bookmark** for this article. The **bookmark** is saved in

The Youtube channel SomeGuyTalking is a **source** that has had a recent upload. A **processor**, that has been configured
to run every day, collects all uploaded videos from SomeGuyTalking and puts them into a **pile** as individual **bookmarks**.
If a video **bookmark** already exists, it is overridden. If it doesn't exist, which will be the case for a recent upload,
a new **bookmark** is created. A Slack **subscriber** is subscribed to the **pile**, the new **bookmark** is sent to the
configured Slack channel.

An RSS feed for a blog is a **source** that has occasional updates. A **processor** is run on a schedule every day to
parse the RSS feed and return a list of **bookmarks** for each post. These **bookmarks** are sent to a **pile**. Newly
added blog posts are sent to an email **subscriber** where an email digest is sent to a mailing list.
