"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mermaidJs = exports.mermaidCss = void 0;
const DEFAULT_MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
const mermaidCss = () => `<style type="text/css">
.mermaid:not([data-processed="true"]) {
  position: relative;
  min-height: 50px;
  background-color: #EFEFEF;
  color: #EFEFEF;
}

.mermaid:not([data-processed="true"])::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3); /* Transparent border */
  border-top-color: #000; /* Solid border on the top side */
  border-radius: 50%; /* Makes it circular */
  transform: translate(-50%, -50%); /* Centers the spinner */
  animation: spin 1s linear infinite; /* 3. Animation */
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>`;
exports.mermaidCss = mermaidCss;
const mermaidJs = (url) => `<script type="module">
  import mermaid from '${url ?? DEFAULT_MERMAID_URL}';
</script>`;
exports.mermaidJs = mermaidJs;
