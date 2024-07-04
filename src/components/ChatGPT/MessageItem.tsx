// Import React and necessary packages
import React from 'react';
import MarkdownIt from 'markdown-it';
import mdHighlight from 'markdown-it-highlightjs';
import mdKatex from 'markdown-it-katex';
import hljs from 'highlight.js/lib/core'; // Import highlight.js core
import 'highlight.js/styles/github.css'; // Choose a style for highlighting

// Import specific languages from highlight.js if needed
import javascript from 'highlight.js/lib/languages/javascript'; // Example: Import JavaScript

// Register languages with highlight.js
hljs.registerLanguage('javascript', javascript); // Example: Register JavaScript

// Define Solidity language grammar
hljs.registerLanguage('solidity', function(hljs) {
  return {
    name: 'Solidity',
    keywords: 'function modifier contract mapping returns struct event address uint',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.NUMBER_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      {
        className: 'keyword',
        beginKeywords: 'function modifier contract mapping returns struct event',
        relevance: 10
      },
      {
        className: 'title',
        begin: hljs.UNDERSCORE_IDENT_RE
      },
      {
        className: 'symbol',
        begin: /[\w@#]+/,
        relevance: 0
      }
    ]
  };
});

// Initialize markdown-it with plugins
const md = MarkdownIt({ html: true }).use(mdKatex).use(mdHighlight, {
  // Configure syntax highlighting with highlight.js
  highlight: (str: string, lang: string) => { // Add type annotations for 'str' and 'lang'
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
      } catch (__) {}
    }

    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Define props interface
import { ChatMessageItemProps } from './interface';

// Define MessageItem component
const MessageItem = (props: ChatMessageItemProps) => {
  const { message } = props;

  return (
    <div className="message-item">
      <div className="meta">
        <div className="avatar">
          <span className={message.role}></span>
        </div>
        <div className="message" dangerouslySetInnerHTML={{ __html: md.render(message.content) }} />
      </div>
    </div>
  );
};

// Export MessageItem component as default
export default MessageItem;
