# Week 4 — Working with a public API (PokéAPI)

## Competency claim

I can use Python with the `requests` library to call a public REST API over HTTPS, parse JSON into dictionaries, pull both top-level and nested fields I need, handle request errors without crashing the script, and explain what I’m doing in plain English. I demonstrated this with [PokéAPI](https://pokeapi.co/) for Pikachu, which is different from the API used in our class demo.

## Reflection

### What I learned from working with APIs

I learned that an API is basically a structured way for one program to ask another service for data. Instead of scraping a webpage, you send a request to a URL and get back JSON you can turn into dictionaries in Python. Using the `requests` library made the HTTP call feel straightforward: you call `get()`, check for errors, then read fields from the parsed JSON. I also saw how real-world data is often nested—for Pikachu’s type, the name wasn’t at the top level; it lived inside `types` → `type` → `name`.

### Challenges I faced

The trickiest part was navigating the nested JSON to pull out the type name without assuming the list was always there. I had to look at the response shape and decide which slot counts as the “primary” type (I used the first entry). Another challenge was knowing the units for `height` and `weight`—the numbers only make sense once you read the API docs (decimeters and hectograms). Handling errors mattered too: network issues or a bad status code shouldn’t crash the script without a clear message.

### How this relates to Human-Centered Design (HCD)

HCD is about designing around people’s needs and contexts. APIs sit in the middle of that story: designers and developers rely on predictable, documented information so apps can show useful, timely content to users. When data is messy, missing, or confusing (like unclear units), the experience suffers—people see wrong conclusions or broken screens. Writing small scripts like this helps me empathize with anyone building a tool that must stay robust when the network or server behaves unexpectedly.
