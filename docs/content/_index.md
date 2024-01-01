---
title: Homepage
---

# Introduction

**GenSite** is an opiniated static website generator made in TypeScript, and
inspired by [Hugo](https://gohugo.io).

## Features

 - [Twing](https://gitlab.com/nightlycommit/twing) templating engine, easier to use than Go Templates
 - [Shiki](https://shiki.matsu.io) highlighting engine, allowing you to provide your own TexMate grammar

# Getting Started

First, create a new NodeJS package and install GenSite:

```shell
$ npm init
$ npm install --save linkdd/gensite#v0.1.0
```

Create a `config.yaml` file:

```yaml
---
title: My website

highlighter:
  theme: monokai
```

Create your base layout in `templates/layouts/base.html`:

```twig
<!DOCTYPE html>
<html>
  <head>
    <title>{{ "{{" }} site.title {{ "}}" }} - {{ "{{" }} page.title {{ "}}" }}</title>
  </head>
  <body>
    <header>
      <h1>{{ "{{" }} page.title {{ "}}" }}</h1>
    </header>
    <main>
      {{ "{%" }} block body {{ "%}" }}
      {{ "{%" }} endblock {{ "%}" }}
    </main>
  </body>
</html>
```

Then create your homepage's layout in `templates/layouts/_default/home.html`:

```twig
{{ "{%" }} extends "layouts/base.html" {{ "%}" }}

{{ "{%" }} block body {{ "%}" }}
  {{ "{{" }} content|raw {{ "}}" }}
{{ "{%" }} endblock {{ "%}" }}
```

Finally, create your homepage in `content/_index.md`:

```markdown
---
title: Homepage
---

# My home page
```

You can now serve your website with:

```shell
$ npm run dev
```

And access it at: [http://localhost:1515](http://localhost:1515).
