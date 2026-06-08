import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";

const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-8 font-serif text-2xl font-bold text-[#1e3a5f]" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 text-lg font-semibold text-[#1a1a2e]" {...props} />
  ),
  p: (props) => <p className="mt-4 leading-relaxed text-slate-700" {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
};

export async function compileMDXContent(source: string) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
  });

  const { default: Content } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return function MDXContent() {
    return <Content components={mdxComponents} />;
  };
}
