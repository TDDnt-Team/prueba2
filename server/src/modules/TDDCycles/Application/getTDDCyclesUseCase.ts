import { IDBCommitsRepository } from "../Domain/IDBCommitsRepository";
import { IGithubRepository } from "../Domain/IGithubRepository";
export class GetTDDCyclesUseCase {
  private readonly dbCommitRepository: IDBCommitsRepository;
  private readonly githubRepository: IGithubRepository;

  constructor(
    dbCommitRepository: IDBCommitsRepository,
    githubRepository: IGithubRepository
  ) {
    this.dbCommitRepository = dbCommitRepository;
    this.githubRepository = githubRepository;
  }

  async updateCommitsWithCoverageData(owner: string, repoName: string, commits: any){
    for(const commit of commits){
      if(!commit.coverage || !commit.test_count){
        try{
          const coverageData = await this.githubRepository.fetchCoverageDataForCommit(owner, repoName, commit.sha);
          commit.coverage = coverageData.coveragePercentage;
          commit.test_count = coverageData.test_count;
          await this.dbCommitRepository.updateCommitCoverageAndTestCount(owner, repoName, commit.sha, coverageData.coveragePercentage, coverageData.test_count);
        } catch (error) {
          console.error(`Error al actualizar el commit ${commit.sha}: ${error}`);
        }
      }
    }
  }

  async execute(owner: string, repoName: string) {
    try {
      const commitsFromGithub = await this.githubRepository.getCommits(
        owner,
        repoName
      );
      let commitsToSave = commitsFromGithub;
      if (await this.dbCommitRepository.repositoryExists(owner, repoName)) {
        commitsToSave = await this.dbCommitRepository.getCommitsNotSaved(
          owner,
          repoName,
          commitsFromGithub
        );
      }
      const commitsInfoForTDDCycles =
        await this.githubRepository.getCommitsInforForTDDCycle(
          owner,
          repoName,
          commitsToSave
        );
      await this.dbCommitRepository.saveCommitsList(
        owner,
        repoName,
        commitsInfoForTDDCycles
      );
      const commits = await this.dbCommitRepository.getCommits(owner, repoName);
      /*
      
      Some commits don't have the test count and coverage information when being retrieved them from the DB
      In such cases we update them with coverage and test count data and save them in the DB with the
      following function
      
      */
      await this.updateCommitsWithCoverageData(owner, repoName, commits);

      return commits;
    } catch (error) {
      throw error;
    }
  }
}
