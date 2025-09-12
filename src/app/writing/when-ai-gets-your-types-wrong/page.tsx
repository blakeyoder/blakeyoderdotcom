import Link from "next/link";
import type { Metadata } from "next";
import { Highlight, themes } from "prism-react-renderer";

export const metadata: Metadata = {
  title: "When AI Gets Your Types Wrong: A Pragmatic Solution | Blake Yoder",
  description: "How I built a TypeScript definitions MCP server to help AI tools understand and mock complex types correctly, turning a testing frustration into a practical solution.",
  openGraph: {
    title: "When AI Gets Your Types Wrong: A Pragmatic Solution",
    description: "How I built a TypeScript definitions MCP server to help AI tools understand and mock complex types correctly, turning a testing frustration into a practical solution.",
    url: "https://blakeyoder.com/writing/when-ai-gets-your-types-wrong",
    siteName: "Blake Yoder",
    images: [
      {
        url: "/when-ai-gets-your-types-wrong-og.png",
        width: 1200,
        height: 630,
        alt: "When AI Gets Your Types Wrong: A Pragmatic Solution",
      },
    ],
    locale: "en_US",
    type: "article",
    publishedTime: "2025-09-11T00:00:00.000Z",
    authors: ["Blake Yoder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "When AI Gets Your Types Wrong: A Pragmatic Solution",
    description: "How I built a TypeScript definitions MCP server to help AI tools understand and mock complex types correctly, turning a testing frustration into a practical solution.",
    images: ["/when-ai-gets-your-types-wrong-og.png"],
  },
};

export default function TypeScriptDefinitionsMCP() {
  return (
    <div className="container-wide">
      <header>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
          <Link href="/writing">← Back to Writing</Link>
        </p>
        <h1>When AI Gets Your Types Wrong</h1>
        <h2 style={{ color: 'var(--text-secondary)', fontWeight: '400', fontSize: '1.5rem', marginTop: '-0.5rem', marginBottom: '2rem' }}>
          A Pragmatic Solution
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '3rem' }}>
          September 11, 2025
        </p>
      </header>

      <main>
        <article>
          <p>
            Today I was writing some unit and integration tests using Claude Code, and I noticed something that was driving me nuts: it really preferred to type cast unknown properties as{' '}
            <Highlight theme={themes.oneDark} code="any" language="typescript">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <code className={className} style={{...style, padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em'}}>
                  {tokens.map((line, i) => 
                    line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))
                  )}
                </code>
              )}
            </Highlight>
            . What I really wanted it to do was use the proper type definitions to mock the objects appropriately.
          </p>

          <p>
            It&apos;s one of those small frustrations that compounds when you&apos;re trying to maintain type safety in your tests. You know the types exist—they&apos;re sitting right there in your{' '}
            <Highlight theme={themes.oneDark} code="node_modules" language="bash">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <code className={className} style={{...style, padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em'}}>
                  {tokens.map((line, i) => 
                    line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))
                  )}
                </code>
              )}
            </Highlight>
            —but the AI keeps reaching for the escape hatch.
          </p>

          <h2>The Workaround That Sparked an Idea</h2>

          <p>
            So I tried something different. I went to the node module type definition of the third-party library I was mocking inside my codebase. I passed that path to Claude Code. I asked it to look there, find the appropriate type definitions, and then create mocks based off those types. And it did pretty well.
          </p>

          <p>
            But really, what this got me thinking was—I should think about how to solve this programmatically.
          </p>

          <p>
            This is the pattern I&apos;ve noticed with AI tools: they excel when they have the right context, but they struggle when that context is buried in places they can&apos;t easily access. The TypeScript definitions were always there, sitting in{' '}
            <Highlight theme={themes.oneDark} code="node_modules" language="bash">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <code className={className} style={{...style, padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em'}}>
                  {tokens.map((line, i) => 
                    line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))
                  )}
                </code>
              )}
            </Highlight>
            , but Claude Code couldn&apos;t efficiently parse and understand them in the moment it needed to create a mock.
          </p>

          <h2>Building TypeScript Definitions MCP</h2>

          <p>
            So I had Claude Code build an MCP server that basically can do lookups against type definitions in node modules to give you information regarding those interfaces and types—from creating mocks all the way to trying to understand the purpose behind why things are built.
          </p>

          <p>
            Out of that, I built <Link href="https://github.com/blakeyoder/typescript-definitions-mcp?tab=readme-ov-file#typescript-definitions-mcp-server" style={{ fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--text-primary)' }}>typescript-definitions-mcp</Link>. It&apos;s an MCP server that you can hook up to Claude Code, Cursor, or any other AI IDE, and you can ask it to give you information regarding types.
          </p>

          <p>
            The beauty of this approach is its simplicity. Instead of trying to teach AI tools how to navigate and understand TypeScript definition files on the fly, we give them a dedicated interface to query type information. The MCP server handles the heavy lifting of parsing definitions, understanding inheritance, and extracting relevant properties.
          </p>

          <h2>How I&apos;m Using It</h2>

          <p>
            Here&apos;s a snippet of how it works in practice. When I need to understand the structure of a complex type, I can simply ask:
          </p>

          <div style={{ 
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            margin: '2rem -2rem',
            overflow: 'auto'
          }}>
            <Highlight
              theme={themes.oneDark}
              code={`> Okay, great. What are all the properties on the daily advanced config?

⏺ typescript-definitions - lookup_type (MCP)(typeName: "DailyAdvancedConfig",
                                            packageName: "@daily-co/daily-js")
  ⎿  {
       "query": {
         "typeName": "DailyAdvancedConfig",
     … +207 lines (ctrl+r to expand)

⏺ DailyAdvancedConfig properties:

  Video/Audio Settings:
  - keepCamIndicatorLightOn?: boolean
  - h264Profile?: string
  - ...`}
              language="bash"
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre 
                  className={className} 
                  style={{
                    ...style,
                    padding: '1.5rem',
                    margin: 0,
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>

          <p>
            Instead of manually digging through definition files or settling for{' '}
            <Highlight theme={themes.oneDark} code="any" language="typescript">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <code className={className} style={{...style, padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em'}}>
                  {tokens.map((line, i) => 
                    line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))
                  )}
                </code>
              )}
            </Highlight>
            {' '}types, I get structured, queryable information about complex types. The AI can now create properly typed mocks, understand API surfaces, and help me write more robust code.
          </p>

          <h2>The Bigger Picture</h2>

          <p>
            This experience reinforced something I&apos;ve been thinking about: the most effective use of AI tools isn&apos;t about replacing human expertise—it&apos;s about removing the friction between having an idea and implementing it. The frustration I felt wasn&apos;t about not knowing how to create proper mocks; it was about the tedious process of manually cross-referencing type definitions every time.
          </p>

          <p>
            Tools like this MCP server don&apos;t make me a better programmer in the traditional sense. They don&apos;t teach me new algorithms or design patterns. What they do is compress the time between &ldquo;I need to understand this type structure&rdquo; and &ldquo;I have the information I need to proceed.&rdquo; That compression is where the real value lies.
          </p>

          <p>
            I wanted to share how I&apos;m using this and how I&apos;m using AI tools to solve real-world problems. It&apos;s not about the grand vision of AI replacing developers—it&apos;s about the small, pragmatic improvements that make daily work more pleasant and productive.
          </p>

          <p>
            Below is a link to my GitHub repo to check it out. I hope it&apos;s as useful to you as it&apos;s become to me.
          </p>

          <div style={{
            backgroundColor: 'var(--background-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.5rem',
            margin: '2rem 0',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '500' }}>
              TypeScript Definitions MCP
            </p>
            <Link 
              href="https://github.com/blakeyoder/typescript-definitions-mcp"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                border: '2px solid var(--text-primary)',
                transition: 'all 0.2s ease'
              }}
            >
              View on GitHub →
            </Link>
          </div>

          <h2>What&apos;s Next</h2>

          <p>
            I&apos;m curious to see how other developers use this tool and what additional type information would be most valuable. The MCP standard makes it easy to extend and customize, so I&apos;m thinking about what other development friction points could be solved with similar approaches.
          </p>

          <p>
            The goal isn&apos;t to build the most sophisticated tool possible—it&apos;s to build the most useful one. Sometimes that means solving small, specific problems really well rather than trying to boil the ocean.
          </p>

          <p>
            If you end up trying it out, I&apos;d love to hear how it works for your use case. The best tools evolve from real-world usage, not theoretical perfection.
          </p>
        </article>
      </main>
    </div>
  );
}