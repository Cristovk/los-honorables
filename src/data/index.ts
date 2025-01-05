import { PATHS } from "./path";

export const getPath = (
  service: keyof typeof PATHS,
  path: string,
  ...params: string[]
) => {
  const basePath = PATHS[service][path];
  if (params.length === 0) return basePath;

  return basePath + params.join("");
};
