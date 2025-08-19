import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type MarkdownViewerProps = {
  content: string;
};

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h4 className="fw-bold mb-3" {...props} />, 
          h2: ({node, ...props}) => <h5 className="fw-semibold mb-2" {...props} />,
          h3: ({node, ...props}) => <h6 className="fw-semibold mb-2 text-primary" {...props} />,
          p:  ({node, ...props}) => <p className="mb-2 lh-base" {...props} />,
          ul: ({node, ...props}) => <ul className="mb-2 ps-3" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}