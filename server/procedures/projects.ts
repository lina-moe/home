import { procedure } from "~/server/trpc";
import { file } from "~/server/api-data";
import { parse } from "yaml";

type ProjectsDocument = {
  projects: {
    name: string;
    description?: string;
    github?: string;
  }[];
}

export default procedure.query(async () => {
  let { data } = await file("projects.yml");
  if (!Array.isArray(data) && data.type === "file") {
    const yaml = parse(Buffer.from(data.content, 'base64').toString()) as ProjectsDocument;
    return yaml.projects;
  }

  return [{ name: "Failed to fetch projects list" }];
});
