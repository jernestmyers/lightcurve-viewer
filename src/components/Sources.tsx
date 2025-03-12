import { useState, useEffect } from "react";
import { SERVICE_URL } from "../configs/constants";
import { Link } from "react-router";

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
                sources.map(s => (
                    <li key={`source-${s.id}`}>
                        <Link to={`/source/${s.id}`}>
                            {`id: ${s.id} | ra: ${s.ra} | dec: ${s.dec}`}
                        </Link>
                    </li>
                ))
            )}
        </main>
    )
}