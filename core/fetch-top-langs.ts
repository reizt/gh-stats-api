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
	ignore?: string[];
	githubToken?: string;
};

export type LangStat = {
	name: string;
	color: string;
	rate: number;
};

type Output = LangStat[];

export const fetchTopLangs = async (input: Input): Promise<Output> => {
	const githubToken = input.githubToken ?? process.env.GITHUB_TOKEN;
	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: new Headers({
			Authorization: `bearer ${githubToken}`,
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
				login: input.username,
				limit: input.limit,
			},
		}),
	});

	const responseJson = await response.json();
	const nodes = responseJson.data.user.repositories.nodes as LangNode[];
	console.log('✅ nodes:', nodes);

	const langsMap: Record<string, { color: string; size: number }> = {};
	let totalSize = 0;
	for (const node of nodes) {
		for (const edge of node.languages.edges) {
			const langName = edge.node.name;
			const langColor = edge.node.color;
			const langSize = edge.size;
			if (input.ignore?.includes(langName) === true) {
				continue;
			}
			totalSize += langSize;
			if (langsMap[langName] == null) {
				langsMap[langName] = { color: langColor, size: 0 };
			}
			langsMap[langName]!.size += langSize;
		}
	}
	console.log('✅ langsMap:', langsMap);

	const langs: Output = [];
	let totalRate = 0;
	for (const langName in langsMap) {
		const lang = langsMap[langName]!;
		langs.push({
			name: langName,
			color: lang.color,
			rate: lang.size / totalSize,
		});
		totalRate += (lang.size * 100) / totalSize;
	}
	langs.sort((a, b) => b.rate - a.rate);
	const limitedLangs = langs.slice(0, input.limit);
	if (totalRate < 99.5) {
		limitedLangs.push({
			name: 'Others',
			color: '#777777',
			rate: 100 - totalRate,
		});
	}
	console.log('✅ limitedLangs:', limitedLangs);
	return limitedLangs;
};
