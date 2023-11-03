import { GithubAdapter } from "../../Github/Repositories/github.API";
import { CommitDataObject } from "../../Github/Domain/commitInterfaces";
import { CommitDTO } from "../Domain/CommitDataObject";
import { CommitRepository } from "../Repositories/commitRepository";

export class CommitTableUseCases {
  constructor(
    private repositoryAdapter: CommitRepository,
    private githubAdapter: GithubAdapter
  ) {
    this.repositoryAdapter = repositoryAdapter;
    this.githubAdapter = githubAdapter;
  }

  async checkNewCommits(
    owner: string,
    repoName: string,
    commitsData: CommitDataObject[]
  ) {
    let commitsToAdd = [];

    for (let index = 0; index < commitsData.length; index++) {
      let currentCommit = commitsData[index];
      let row = await this.repositoryAdapter.commitExists(
        owner,
        repoName,
        currentCommit.sha
      );
      if (row.length != 0) {
        break;
      } else {
        commitsToAdd.push(currentCommit);
      }
    }
    return commitsToAdd;
  }

  async getCommitsAPI(owner: string, repoName: string) {
    try {
      const commits = await this.githubAdapter.obtainCommitsOfRepo(
        owner,
        repoName
      );
      return commits;
    } catch (error) {
      console.error("Error en la obtención de commits:", error);
      throw { error: "Error en la obtención de commits" };
    }
  }
  async getCommitsFromShaAPI(
    owner: string,
    repoName: string,
    commits: CommitDataObject[]
  ) {
    try {
      const commitsFromSha = await Promise.all(
        commits.map((commit: any) => {
          return this.githubAdapter.obtainCommitsFromSha(
            owner,
            repoName,
            commit.sha
          );
        })
      );
      const commitsData: CommitDTO[] = commitsFromSha.map((commit: any) => {
        return {
          html_url: commit.html_url,
          stats: {
            total: commit.stats.total,
            additions: commit.stats.additions,
            deletions: commit.stats.deletions,
          },
          commit: {
            date: commit.commit.author.date,
            message: commit.commit.message,
            url: commit.commit.url,
            comment_count: commit.commit.comment_count,
          },
          sha: commit.sha,
          coverage: commit.coveragePercentage,
        };
      });
      return commitsData;
    } catch (error) {
      console.error("Error en la obtención de commits:", error);
      throw { error: "Error en la obtención de commits" };
    }
  }

  async saveCommitsDB(
    owner: string,
    repoName: string,
    newCommits: CommitDTO[]
  ) {
    try {
      if (newCommits.length > 0) {
        await Promise.all(
          newCommits.map(async (commit: CommitDTO) => {
            await this.repositoryAdapter.saveCommitInfoOfRepo(
              owner,
              repoName,
              commit
            );
          })
        );
      }
    } catch (error) {
      console.error("Error en la actualización de la tabla de commits:", error);
    }
  }
}