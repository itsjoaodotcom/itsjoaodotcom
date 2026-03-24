"use client";

import { use } from "react";
import { useShell } from "../../../../../components/ShellContext";
import NewAgentContent from "../../new/NewAgentContent";

export default function EditAgentPage({ params }) {
  const { slug } = use(params);
  const { getAgentBySlug } = useShell();
  const agent = getAgentBySlug(slug);

  if (!agent) return <div style={{ padding: 40 }}>Agent not found</div>;

  return <NewAgentContent editId={agent.id} />;
}
