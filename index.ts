import { Client } from "@notionhq/client";
import fs from "fs";
import "dotenv/config";

const NOTION_INTEGRATION_SECRET = process.env
  .NOTION_INTEGRATION_SECRET as string;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID as string;
const notion = new Client({ auth: NOTION_INTEGRATION_SECRET });

// 1. Recursion on nested blocks
// 2. Recursion on block size
const fetchPageBlocks = async (id: string) => {
  const blockListObj = await notion.blocks.children.list({
    block_id: id,
    page_size: 50,
  });

  const hydratedBlocks = Promise.all(
    blockListObj.results.map(async (block) => ({
      ...block,
      children: block["has_children"] ? await fetchPageBlocks(block.id) : [],
    }))
  );

  return hydratedBlocks;
};

const serializeRead = async (doc: any) => {
  return fs.promises.writeFile(
    "database.json",
    JSON.stringify(doc, undefined, 2)
  );
};

(async () => {
  const databaseData = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
  });
  const databaseBlocks = await Promise.all(
    databaseData.results.map((page) => fetchPageBlocks(page.id))
  );
  // This completes reading
  await serializeRead({
    database: databaseData,
    blocks: databaseBlocks.flat(),
  });
})();
