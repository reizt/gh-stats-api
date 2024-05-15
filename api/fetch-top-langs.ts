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
	username: string;
	limit: number;
};

export type LangStat = {
	name: string;
	color: string;
	rate: number;
};

type Output = LangStat[];

export const fetchTopLangs = async ({ username, limit }: Input): Promise<Output> => {
	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: new Headers({
			Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
		}),
		body: JSON.stringify({
			query: `
      query userInfo($login: String!, $limit: Int!) {
        user(login: $login) {
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
				login: username,
				limit,
			},
		}),
	});

	const responseJson = await response.json();
	const nodes = responseJson.data.user.repositories.nodes as LangNode[];

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
