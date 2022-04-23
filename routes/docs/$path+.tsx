import { Head, useData } from "aleph/react";
import { CSS, render } from "https://deno.land/x/gfm@0.1.20/mod.ts";

import "https://esm.sh/prismjs@1.27.0/components/prism-jsx?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript?no-check";

export const data: Data = {
  get: async (req, ctx) => {
    try {
      const { path } = ctx.params;
      const markdown = await Deno.readTextFile(`./docs/${path}.md`);
      const html = render(markdown);
      // todo(pipiduck): read markdown file from $path
      return ctx.json({ html });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return ctx.json({ error: "not-found" });
      }
      return ctx.json({ error: error.message });
    }
  },
};

export default function Markdown() {
  // todo(pipiduck): use `useData()` to get markdown content

  const { data: { html, error } } = useData<
    { html?: string; error?: string }
  >();

  if (error) {
    if (error === "not-found") {
      return <div>Not Found</div>;
    }
    return <div>{error}</div>;
  }

  return (
    <>
      <Head>
        <style>{CSS}</style>
      </Head>
      <div
        data-color-mode="light"
        data-light-theme="light"
        data-dark-theme="dark"
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: html! }}
      />
    </>
  );
}
