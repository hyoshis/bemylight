import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName
    ? `/${repositoryName}`
    : "";
const taskAgentUrl =
  process.env.NEXT_PUBLIC_TASK_AGENT_URL ??
  "https://be-my-light-task-vbcr1m.azurewebsites.net/api/organize-tasks";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  typedRoutes: true,
  env: {
    NEXT_PUBLIC_TASK_AGENT_URL: taskAgentUrl,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
