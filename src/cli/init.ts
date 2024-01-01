import path from 'path'
import { promises as fs } from 'fs'

import { command, positional } from 'cmd-ts'
import { Directory } from 'cmd-ts/batteries/fs'
import prompt from 'prompt'

import yaml from 'js-yaml'

interface PromptResult {
  title: string
  description: string
}

const PROMPT_SCHEMA = {
  properties: {
    title: {
      description: 'Title',
      required: true,
    },
    description: {
      description: 'Description',
      required: true,
    },
  },
}

const tmplBase = (title: string) => `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
  </head>
  <body>
    {% block body %}
    {% endblock %}
  </body>
</html>
`

const tmplHome = () => `{% extends "layouts/base.html" %}

{% block body %}
  <h1>Homepage</h1>
  <hr />
  <main>
    {{ content|raw }}
  </main>
{% endblock %}
`

const tmplSection = () => `{% extends "layouts/base.html" %}

{% block body %}
  <h1>{{ page.title }}</h1>
  <hr />
  <ul>
    {% for child in page.children %}
      <li><a href="{{ child.url }}">{{ child.title }}</a></li>
    {% endfor %}
  </ul>
  <hr />
  <main>
    {{ content|raw }}
  </main>
{% endblock %}
`

const tmplSingle = () => `{% extends "layouts/base.html" %}

{% block body %}
  <h1>{{ page.title }}</h1>
  <hr />
  <main>
    {{ content|raw }}
  </main>
{% endblock %}
`

export default command({
  name: 'init',
  description: 'Create a new project',
  args: {
    project: positional({
      description: "Path to project's root",
      type: Directory,
    }),
  },
  async handler({ project }) {
    try {
      const params: PromptResult = await new Promise((resolve, reject) => {
        prompt.start({
          message: '::',
        })

        prompt.get(PROMPT_SCHEMA, (err, result) => {
          if (err !== null) {
            reject(err)
          } else {
            const { title, description } = result
            resolve({ title, description } as PromptResult)
          }
        })
      })

      const dirs = [
        path.join(project, 'static'),
        path.join(project, 'content'),
        path.join(project, 'data'),
        path.join(project, 'templates', 'layouts', '_default'),
      ]

      await Promise.all(
        dirs.map(async (dir) => {
          await fs.mkdir(dir, { recursive: true })
        }),
      )

      await fs.writeFile(
        path.join(project, 'config.yaml'),
        yaml.dump({
          title: params.title,
          description: params.description,
        }),
      )

      await fs.writeFile(
        path.join(project, 'content', '_index.md'),
        '---\ntitle: Homepage\n---\n\n# Welcome\n',
      )

      await fs.writeFile(
        path.join(project, 'templates', 'layouts', 'base.html'),
        tmplBase(params.title),
      )

      await fs.writeFile(
        path.join(project, 'templates', 'layouts', '_default', 'home.html'),
        tmplHome(),
      )

      await fs.writeFile(
        path.join(project, 'templates', 'layouts', '_default', 'section.html'),
        tmplSection(),
      )

      await fs.writeFile(
        path.join(project, 'templates', 'layouts', '_default', 'single.html'),
        tmplSingle(),
      )
    } catch (err) {
      console.error(err)
      process.exit(1)
    }

    console.log('Project is ready, you can run:')
    console.log(`  $ npx gin serve -p ${project}`)
  },
})
