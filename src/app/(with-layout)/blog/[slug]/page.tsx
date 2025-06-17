import { FC } from "react";

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const Post = (await import(`@/blog/${slug}.mdx`)) as FC;

  return <Post />;
}

export function generateStaticParams() {
  return [{ slug: 'welcome' }, { slug: 'about' }];
}

export const dynamicParams = false;
