const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

interface GraphqlEnvelope<T> {
  data?: T;
  errors?: unknown;
}

export async function postLeetCodeGraphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
  timeoutMs = 8_000,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(LEETCODE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        'user-agent': 'LeetCode-Assistant-Discord-Bot/2.0',
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`LeetCode GraphQL returned HTTP ${response.status}.`);
    }

    const envelope = (await response.json()) as GraphqlEnvelope<T>;
    if (!envelope.data) {
      throw new Error('LeetCode GraphQL returned no data.');
    }
    return envelope.data;
  } finally {
    clearTimeout(timeout);
  }
}
