import axios from 'axios';

type LangNode = {
  name: string;
  languages: {
    edges: {
      size: number;
      node: {
        name: string;
        color: string;
      };
    }[];
  };
};

type Input = {
  userName: string;
  limit: number;
};

export type LangStat = {
  name: string;
  color: string;
  rate: number;
};

type Output = LangStat[];

export const fetchTopLangs = async ({ userName, limit }: Input): Promise<Output> => {
  const response = await axios.request({
    method: 'POST',
    url: 'https://api.github.com/graphql',
    data: {
      query: `
      query userInfo($login: String!, $limit: Int!) {
        user(login: $login) {
          # fetch only owner repos & not forks
          repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
            nodes {
              name
              languages(first: $limit, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        login: userName,
        limit,
      },
    },
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
  });

  const nodes = response.data.data.user.repositories.nodes as LangNode[];

  const langsMap: Record<string, { color: string; size: number }> = {};
  let totalSize = 0;
  for (const node of nodes) {
    for (const edge of node.languages.edges) {
      const langName = edge.node.name;
      const langColor = edge.node.color;
      const langSize = edge.size;
      totalSize += langSize;
      if (langsMap[langName] == null) {
        langsMap[langName] = { color: langColor, size: 0 };
      }
      langsMap[langName]!.size += langSize;
    }
  }
  const langs: Output = [];
  for (const langName in langsMap) {
    const lang = langsMap[langName]!;
    langs.push({
      name: langName,
      color: lang.color,
      rate: lang.size / totalSize,
    });
  }
  langs.sort((a, b) => b.rate - a.rate);
  return langs;
};
