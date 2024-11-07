import { GithubAPIRepository } from "../domain/GithubAPIRepositoryInterface";
import { CommitDataObject } from "../domain/githubCommitInterfaces";
import { JobDataObject } from "../domain/jobInterfaces";

export class PortGetTDDCycles {
  adapter: GithubAPIRepository;
  constructor(githubAPIRepository: GithubAPIRepository) {
    this.adapter = githubAPIRepository;
  }

  async obtainCommitsOfRepo(
    owner: string,
    repoName: string,
  ): Promise<CommitDataObject[]> {
    return await this.adapter.obtainCommitsOfRepo(owner, repoName);
  }

  async obtainJobsData(
    owner: string,
    repoName: string,
  ): Promise<JobDataObject[]> {
    return await this.adapter.obtainJobsOfRepo(owner, repoName);
  }
}

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} (hora de Bolivia)`;
};