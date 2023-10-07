import { useEffect, useState } from "react";
import { GetTDDCycles } from "../../TDDCycles-Visualization/application/GetTDDCycles";
import { GithubAPIAdapter } from "../../TDDCycles-Visualization/repository/GithubAPIAdapter";
import TDDCycleCard from "./TDDCycleCard";
import { JobDataObject } from "../../TDDCycles-Visualization/domain/jobInterfaces";
import { CommitDataObject, CommitInformationDataObject } from "../../TDDCycles-Visualization/domain/githubCommitInterfaces";

interface CycleReportViewProps {
  port: GithubAPIAdapter | any;
}

function TDDCycleList({ port }: CycleReportViewProps) {
  const repoOwner = "DwijanX";
  const repoName = "Bulls-and-Cows";

  const [commitsInfo, setCommitsInfo] = useState<CommitInformationDataObject[] | null>(null);
  const [jobsByCommit, setJobsByCommit] = useState<Record<string, JobDataObject> | null>(null);

  const getTDDCycles = new GetTDDCycles(port);

  const obtainJobsData = async () => {
    try {
      console.log("Fetching commits data...");
      const jobsData: Record<string, JobDataObject> = await getTDDCycles.obtainJobsData(repoOwner, repoName);
      setJobsByCommit(jobsData);
    } catch (error) {
      console.error('Error obtaining jobs:', error);
    }
  };

  const obtainCommitsData = async () => {
    console.log("Fetching commit information...");
    try {
      const commits: CommitDataObject[] = await getTDDCycles.obtainCommitsOfRepo(repoOwner, repoName);
      if (commits) {
        console.log("Fetching commit information...");
        const commitsInfoData: CommitInformationDataObject[] = await Promise.all(
          commits.map((commit) => getTDDCycles.obtainCommitInformation(repoOwner, repoName, commit.sha))
        );
        setCommitsInfo(commitsInfoData);
      }
    } catch (error) {
      console.error('Error obtaining commit information:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await obtainJobsData();
      await obtainCommitsData();
    };
    fetchData();
  }, []);

  console.log("Commits Info:", commitsInfo);

  return (
    <>
      <h1>Repository: {repoName}</h1>
      {jobsByCommit != null && commitsInfo != null && commitsInfo.map((commit) => (
        <TDDCycleCard key={commit.sha} commit={commit} jobs={jobsByCommit[commit.sha]} />
      ))}
    </>
  );
}

export default TDDCycleList;