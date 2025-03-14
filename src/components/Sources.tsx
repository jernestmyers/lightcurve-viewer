import { useState, useEffect } from "react";
import { SERVICE_URL } from "../configs/constants";
import { Table } from "./Table";

export function Sources() {
  const [sources, setSources] = useState(undefined);

  useEffect(() => {
    async function getSources() {
      const sources = await (
        await fetch(`${SERVICE_URL}/sources/`)
      ).json();
      setSources(sources)
    }
    getSources();
  }, [])  

    return (
        <main>
            <h2>Sources</h2>
            {sources && (
                <Table sources={sources} />
            )}
        </main>
    )
}