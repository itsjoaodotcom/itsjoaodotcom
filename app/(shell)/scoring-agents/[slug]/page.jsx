"use client";

import { use } from "react";
import AgentDetailContent from "./AgentDetailContent";

export default function AgentDetailPage({ params }) {
  const { slug } = use(params);
  return <AgentDetailContent slug={slug} />;
}
