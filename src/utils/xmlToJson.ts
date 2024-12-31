import axios from "axios";
import { JSDOM } from "jsdom";

const processNode = (node: Element): any => {
  const children = Array.from(node.children);

  if (children.length === 0) {
    return node.textContent?.trim() || "";
  }

  const result: Record<string, any> = {};
  children.forEach((child) => {
    const key = child.tagName;
    if (result[key]) {
      // Si la clave ya existe, convierte el valor en un array
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]];
      }
      result[key].push(processNode(child));
    } else {
      result[key] = processNode(child);
    }
  });

  return result;
};

export const extractDataFromXml = (xmlData: string, rootTag: string): any => {
  try {
    const dom = new JSDOM(xmlData, { contentType: "text/xml" });
    const document = dom.window.document;

    const rootElements = document.querySelectorAll(rootTag);
    if (!rootElements.length)
      throw new Error(`Root tag <${rootTag}> not found`);

    // Si hay múltiples elementos, devolver array
    return Array.from(rootElements).map((el) => processNode(el as Element));
  } catch (error: any) {
    throw new Error(`Error extracting data: ${error.message}`);
  }
};

export const fetchAndProcessXml = async (
  url: string,
  rootTag: string
): Promise<any> => {
  try {
    const response = await axios.get(url);
    return extractDataFromXml(response.data, rootTag);
  } catch (error) {
    console.error("Error fetching or processing XML:", error);
    throw error;
  }
};
