import PubMedAdapter from '../sources/PubMedAdapter'
import type { SearchResultItem, SourceAdapter } from '../sources/SourceAdapter'

// simple facade for combining multiple adapters; currently only PubMed
export default class SearchAggregatorService {
  private adapters: SourceAdapter[]

  constructor() {
    // future: instantiate other adapters based on config
    this.adapters = [new PubMedAdapter()]
  }

  /** perform query across all registered sources */
  async searchAll(query: string): Promise<SearchResultItem[]> {
    // collecting results from each adapter sequentially; duplicates not deduped
    const results: SearchResultItem[] = []
    for (const a of this.adapters) {
      const r = await a.search(query)
      results.push(...r)
    }
    return results
  }
}
