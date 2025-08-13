// Web search integration for The Admit Coach
// Using DuckDuckGo Instant Answer API as a free, privacy-friendly option

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // Use DuckDuckGo Instant Answer API
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    
    if (!response.ok) {
      throw new Error('Search API request failed');
    }

    const data = await response.json();
    
    // Extract relevant information
    const results: SearchResult[] = [];
    
    // Add abstract if available
    if (data.Abstract) {
      results.push({
        title: data.Heading || 'Search Result',
        snippet: data.Abstract,
        url: data.AbstractURL || '#'
      });
    }
    
    // Add related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.slice(0, 3).forEach((topic: any) => {
        if (topic.Text) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            snippet: topic.Text,
            url: topic.FirstURL || '#'
          });
        }
      });
    }
    
    // If no results from DuckDuckGo, provide a fallback
    if (results.length === 0) {
      results.push({
        title: 'Search Results',
        snippet: `I searched for "${query}" but couldn't find specific results. You might want to try a more specific search term or check the official websites of the schools you're interested in.`,
        url: '#'
      });
    }
    
    return results;
  } catch (error) {
    console.error('Web search error:', error);
    
    // Fallback response
    return [{
      title: 'Search Unavailable',
      snippet: `I'm unable to search the web right now, but I can still help you with general college application advice. For specific information about schools, I recommend visiting their official websites.`,
      url: '#'
    }];
  }
}

// Enhanced search for college-specific information
export async function searchCollegeInfo(query: string): Promise<SearchResult[]> {
  const collegeQuery = `${query} college university admissions requirements`;
  return searchWeb(collegeQuery);
}

// Search for current events and trends
export async function searchCurrentEvents(query: string): Promise<SearchResult[]> {
  const currentQuery = `${query} 2024 2025 current trends`;
  return searchWeb(currentQuery);
} 