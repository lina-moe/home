import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.GITHUB_API_KEY
});

export const file = (path: string) => octokit.repos.getContent({
  owner: process.env.DATA_REPO_OWNER!,
  repo: process.env.DATA_REPO!,
  path
});
