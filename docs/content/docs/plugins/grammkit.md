---
title: Grammkit
---

# Configuration

In your `config.yaml`, add the following:

```yaml
---

# ...

plugins:
  - ../contrib/grammkit
```

# Usage

In your markdown files (or your templates):

```markdown
{{ "{% apply grammkit %}" }}
start = left ("+" / "-") right
{{ "{% endapply %}" }}
```

This result in the following:

```html
<div class="grammkit-diagrams">
  <style scoped>
    /* css to render svg diagrams correctly */
  </style>
  <div class="grammkit-diagram">
    <div class="grammkit-diagram-title">start</div>
    <div class="grammkit-diagram-svg">
      <!-- svg diagram -->
    </div>
    <div class="grammkit-diagram-src">
      <details>
        <summary>Show source</summary>
        <pre><code class="language-text">start = left ("+" / "-") right</code></pre>
      </details>
    </div>
  </div>
</div>
```

You can then add your own CSS style to render the generated HTML the way you
want.
