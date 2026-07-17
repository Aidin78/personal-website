import { proof } from "@/content/proof";

export type GithubRepoCard = {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stars: number;
};

type GithubApiRepo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

function mapRepo(repo: GithubApiRepo): GithubRepoCard {
  return {
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
  };
}

function fallbackRepos(): GithubRepoCard[] {
  return proof.githubRepos.map((name) => ({
    name,
    description: null,
    htmlUrl: `https://github.com/${proof.githubUsername}/${name}`,
    language: null,
    stars: 0,
  }));
}

export async function getPinnedRepos(): Promise<GithubRepoCard[]> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aidin-resume-portfolio",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${proof.githubUsername}/repos?per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return fallbackRepos();
    }

    const repos = (await response.json()) as GithubApiRepo[];
    const byName = new Map(
      repos.filter((repo) => !repo.fork).map((repo) => [repo.name, repo]),
    );

    const pinned = proof.githubRepos
      .map((name) => byName.get(name))
      .filter((repo): repo is GithubApiRepo => Boolean(repo))
      .map(mapRepo);

    return pinned.length > 0 ? pinned : fallbackRepos();
  } catch {
    return fallbackRepos();
  }
}
