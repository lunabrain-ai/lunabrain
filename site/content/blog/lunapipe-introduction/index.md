---
title: "LunaPipe Introduction: Bash pipelining for LLMs"
description: "LLMs can help you out in your terminal."
slug: lunapipe-introduction
date: 2023-04-19T07:00:00.000Z
categories: [tools, llms, open-source]
tags: [lunapipe, tools]
contributors: ["breadchris"]
draft: false
weight: 50
images: [cover.png]
pinned: false
homepage: false
---

I don't know about you, but I am pretty lazy.

I already wrote a readme for [lunapipe](https://github.com/lunabrain-ai/lunapipe), why do I need to write a post too? Maybe I can get some help:

````bash
cat README.md | lunapipe -t markdown "Write me a short section of a blog post that shows off lunapipe. It is meta because I am using lunapipe to write the post."
````

> If you're like me, you love finding new tools that make your development workflow smoother. That's why I want to introduce you to lunapipe - a tool that lets you use OpenAI's GPT models in your terminal.
>
> Lunapipe feels like a bash utility, but it's so much more. You can generate code using templates and models, and even pipe in text for lunapipe to analyze. It's like having an AI assistant right in your terminal!
>
> Installation is super easy - just copy and paste the installation command in your terminal, and you're good to go. Once installed, you can configure your API key so you don't have to keep entering it for each command you run.
>
> Using lunapipe is a breeze. Just type in your prompt and let it do its thing. You can even generate code using templates and models, which saves you time and effort.
>
> If you're a developer looking to speed up your workflow, I highly recommend giving lunapipe a try.

I mean, yeah, that is pretty much it. Kind of bland though, don't you think? Unfortunately GPT models aren't known
for their "writer's voice".

## Finding answers to questions is fun
I always have a ChatGPT tab open to help me with writer's block or to give me some external insight into a problem I am looking at.
Unlike your typical Google search, which has been eternally plagued by SEO spam, a ChatGPT response is probably going to give you
something worth reading right off the bat.
Simon Willison wrote an [nice post](https://simonwillison.net/2023/Mar/27/ai-enhanced-development/) explaining how ChatGPT has enhanced their
workflow:

> The thing I’m most excited about in our weird new AI-enhanced reality is the way it allows me to be more ambitious with my projects.


They have also written a CLI tool of [their own](https://github.com/simonw/llm) which I imagine emerged from a similar need of mine.

I hate context switching. It derails me faster than a train running over TNT.

![wile e. coyote about to be run over by a train](train.jpg)

So, instead of crossing the abyss of attention (my all too alluring browser tabs) to get to the tool to unblock me,
I wrote a CLI to keep my attention where it should be, in my terminal.

What I soon realized is that with the power of GPT in your terminal, you can start tossing data at it to help you out.

Want to write some code? Just ask and pipe it into a file!

```shell
lunapipe "Write me a web server" > server.py
```

Now obviously this is not going to work as well as you might want. What language do you want it? Do you want to use a specific library?
All of these questions should be resolved with *prompt engineering*, but again, like I established, I am **lazy**. So let's do something about that:

```shell
lunapipe -t function -p language=python "http server" > server.py
```

```python
# server.py
def http_server():
    # Import necessary modules
    import http.server
    import socketserver

    # Specify the address and port number for the server
    address = ("", 8000)

    # Set up the server
    with http.server.HTTPServer(address, http.server.SimpleHTTPRequestHandler) as server:
        try:
            # Start the server
            server.serve_forever()
        except KeyboardInterrupt:
            # Stop the server if the user interrupts the program
            server.shutdown()
```

Not exactly how I would write it, but not bad! I can work with it. I have never written any Rust, I wonder how that looks?

```shell
lunapipe -t function -p language=rust "http server" > server.rs
```

```rust
use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("localhost:8080").unwrap();
    println!("HTTP server started on http://localhost:8080");

    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        let mut buffer = [0; 1024];
        stream.read(&mut buffer).unwrap();

        let response = "HTTP/1.1 200 OK\r\n\r\nHello, World!";
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    }
}
```

I have no clue if this works, let's run it! Oh wait, I have no idea how Rust works.

```shell
lunapipe "How do I run server.rs?"
```

## Templates
By passing `-t` to lunapipe, you can use templates that are already created, or ones of your own. Here is what the template for `function` looks like:
```gotemplate
{{$lang := param "language"}}
You are a developer who writes code. Write the code of a function{{if $lang}}, written in {{$lang}},{{end}} based on the following description:
```

The templates are written using go templates which are pretty [easy to understand](https://www.digitalocean.com/community/tutorials/how-to-use-templates-in-go).
Since it is easy to expose functions written in Go inside of templates, you could write something like this:

```gotemplate
Given the following git state, write a short description of what the state of the repo is:

git status:
{{shell "git status"}}
```

```shell
lunapipe -t gitinfo "help me!"
```
> The repo is on the "main" branch and is up-to-date with the remote "origin/main" branch. There are several modified files (including .gitignore, go.mod, and go.sum) and some untracked files. The changes have not been staged for commit, but the suggested commands to update the changes and discard them are provided.

## What this is not
This is not going to automatically code for you. In fact, if you go to run the rust server by itself, it will not work, you
will get a bunch of errors. Like I said before, this is a tool for unblocking you. I think of GPT as the world's smartest
rubber ducky.

## Try it yourself!
Go forth and [try it for yourself](https://github.com/lunabrain-ai/lunapipe)!

Run this command for a quick install:
```shell
curl https://raw.githubusercontent.com/lunabrain-ai/lunapipe/main/scripts/install.sh | sh
lunapipe configure
```

## Demonstration
I like watching videos of tools sometimes, so I put one together for others like me out there:

<iframe width="560" height="315" src="https://www.youtube.com/embed/2Y4i3rtFvAI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Happy hacking!
