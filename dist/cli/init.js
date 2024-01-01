"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const cmd_ts_1 = require("cmd-ts");
const fs_2 = require("cmd-ts/batteries/fs");
const prompt_1 = __importDefault(require("prompt"));
const js_yaml_1 = __importDefault(require("js-yaml"));
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
};
const tmplBase = (title) => `<!DOCTYPE html>
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
`;
const tmplHome = () => `{% extends "layouts/base.html" %}

{% block body %}
  <h1>Homepage</h1>
  <hr />
  <main>
    {{ content|raw }}
  </main>
{% endblock %}
`;
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
`;
const tmplSingle = () => `{% extends "layouts/base.html" %}

{% block body %}
  <h1>{{ page.title }}</h1>
  <hr />
  <main>
    {{ content|raw }}
  </main>
{% endblock %}
`;
exports.default = (0, cmd_ts_1.command)({
    name: 'init',
    description: 'Create a new project',
    args: {
        project: (0, cmd_ts_1.positional)({
            description: "Path to project's root",
            type: fs_2.Directory,
        }),
    },
    async handler({ project }) {
        try {
            const params = await new Promise((resolve, reject) => {
                prompt_1.default.start({
                    message: '::',
                });
                prompt_1.default.get(PROMPT_SCHEMA, (err, result) => {
                    if (err !== null) {
                        reject(err);
                    }
                    else {
                        const { title, description } = result;
                        resolve({ title, description });
                    }
                });
            });
            const dirs = [
                path_1.default.join(project, 'static'),
                path_1.default.join(project, 'content'),
                path_1.default.join(project, 'data'),
                path_1.default.join(project, 'templates', 'layouts', '_default'),
            ];
            await Promise.all(dirs.map(async (dir) => {
                await fs_1.promises.mkdir(dir, { recursive: true });
            }));
            await fs_1.promises.writeFile(path_1.default.join(project, 'config.yaml'), js_yaml_1.default.dump({
                title: params.title,
                description: params.description,
            }));
            await fs_1.promises.writeFile(path_1.default.join(project, 'content', '_index.md'), '---\ntitle: Homepage\n---\n\n# Welcome\n');
            await fs_1.promises.writeFile(path_1.default.join(project, 'templates', 'layouts', 'base.html'), tmplBase(params.title));
            await fs_1.promises.writeFile(path_1.default.join(project, 'templates', 'layouts', '_default', 'home.html'), tmplHome());
            await fs_1.promises.writeFile(path_1.default.join(project, 'templates', 'layouts', '_default', 'section.html'), tmplSection());
            await fs_1.promises.writeFile(path_1.default.join(project, 'templates', 'layouts', '_default', 'single.html'), tmplSingle());
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Project is ready, you can run:');
        console.log(`  $ npx gin serve -p ${project}`);
    },
});
