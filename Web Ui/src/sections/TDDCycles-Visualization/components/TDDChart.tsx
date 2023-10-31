import { CommitDataObject } from "../../../modules/TDDCycles-Visualization/domain/githubCommitInterfaces";
import { JobDataObject } from "../../../modules/TDDCycles-Visualization/domain/jobInterfaces";
import { Line, getElementAtEvent } from "react-chartjs-2";
import { useRef } from "react";
import "../styles/TDDChartStyles.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  LineElement
);

interface CycleReportViewProps {
  commits: CommitDataObject[] | null;
  jobsByCommit: JobDataObject[] | null;
}

function TDDCharts({ commits, jobsByCommit }: CycleReportViewProps) {
  function getDataLabels() {
    if (commits != null) {
      const commitsArray = commits.map((commit) => commits.indexOf(commit));
      return commitsArray;
    } else {
      return [];
    }
  }

  const getBarStyle = (commit: CommitDataObject) => {
    if (jobsByCommit != null) {
      const job = jobsByCommit.find((job) => job.sha === commit.sha);
      console.log("TEST", job);
      if (job != null && job.conclusion === "success") {
        return "green";
      } else {
        return "red";
      }
    } else {
      return "black";
    }
  };

  function getColorConclusion() {
    if (commits != null && jobsByCommit != null) {
      const conclusions = commits.map((commit) => getBarStyle(commit));
      return conclusions.reverse();
    } else {
      return ["white"];
    }
  }

  function getCommitStats() {
    if (commits != null) {
      const additions = commits
        .map((commit) => commit.stats.additions)
        .reverse();
      const deletions = commits
        .map((commit) => commit.stats.deletions)
        .reverse();
      const total = commits.map((commit) => commit.stats.total).reverse();
      return [additions, deletions, total];
    } else {
      return [[], [], []];
    }
  }

  function getCommitLink() {
    if (commits != null) {
      const urls = commits.map((commit) => commit.html_url);
      return urls.reverse();
    } else {
      return [];
    }
  }

  const dataLineChart = {
    labels: getDataLabels(),
    datasets: [
      {
        label: "Lineas de Código Modificadas",
        backgroundColor: getColorConclusion(),
        data: getCommitStats()[2],
        links: getCommitLink(),
      },
    ],
  };

  const optionsLineChart = {
    responsive: true,
    pointRadius: 12,
    pointHoverRadius: 15,
    scales: {
      x: {
        title: {
          display: true,
          text: "Commits realizados",
          font: {
            size: 30,
            weight: "bold",
            lineHeight: 1.2,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Líneas de Código Modificadas",
          font: {
            size: 30,
            weight: "bold",
            lineHeight: 1.2,
          },
        },
      },
    },
  };

  const chartRef = useRef<any>();
  const onClick = (event: any) => {
    if (getElementAtEvent(chartRef.current, event).length > 0) {
      const dataSetIndexNum = getElementAtEvent(chartRef.current, event)[0]
        .datasetIndex;
      const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;
      console.log(dataLineChart.datasets[dataSetIndexNum].links[dataPoint]);
      window.open(
        dataLineChart.datasets[dataSetIndexNum].links[dataPoint],
        "_blank"
      );
    }
  };

  return (
    <div className="lineChartContainer">
      <h2>Gráfico de Lineas y puntos</h2>
      <Line
        height="100"
        data={dataLineChart}
        options={optionsLineChart}
        onClick={onClick}
        ref={chartRef}
      />
    </div>
  );
}

export default TDDCharts;
