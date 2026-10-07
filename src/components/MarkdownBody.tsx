function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function MarkdownBody({ content }: { content: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let listBuf: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuf) return;
    const Tag = listBuf.ordered ? "ol" : "ul";
    nodes.push(
      <Tag key={`list-${nodes.length}`}>
        {listBuf.items.map((item, idx) => (
          <li key={idx}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listBuf = null;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("|") && lines[i + 1]?.includes("---")) {
      flushList();
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!lines[i].includes("---")) {
          rows.push(
            lines[i]
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );
        }
        i++;
      }
      if (rows.length) {
        const [head, ...body] = rows;
        nodes.push(
          <table key={`tbl-${nodes.length}`}>
            <thead>
              <tr>
                {head.map((c, ci) => (
                  <th key={ci}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      }
      continue;
    }

    const ul = line.match(/^[-*]\s+(.*)/);
    const ol = line.match(/^\d+\.\s+(.*)/);
    const check = line.match(/^-\s\[[ x]\]\s+(.*)/i);

    if (ul || ol || check) {
      const ordered = Boolean(ol);
      const text = check?.[1] ?? ul?.[1] ?? ol?.[1] ?? "";
      if (!listBuf || listBuf.ordered !== ordered) {
        flushList();
        listBuf = { ordered, items: [] };
      }
      listBuf.items.push(text);
      i++;
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      nodes.push(<h3 key={i}>{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={i}>{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("# ")) {
      nodes.push(<h1 key={i}>{renderInline(line.slice(2))}</h1>);
    } else if (line.trim() === "---") {
      nodes.push(<hr key={i} className="my-4 border-line" />);
    } else if (line.trim() === "") {
      // skip
    } else if (line.startsWith("*") && line.endsWith("*")) {
      nodes.push(
        <p key={i} className="italic opacity-80">
          {renderInline(line.replace(/^\*|\*$/g, ""))}
        </p>
      );
    } else {
      nodes.push(<p key={i}>{renderInline(line)}</p>);
    }
    i++;
  }
  flushList();

  return <div className="prose-seo">{nodes}</div>;
}
