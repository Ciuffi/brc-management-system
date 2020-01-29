import Layout from "../components/Layout";
import RunHistory from "../components/RunHistory";
import dbHandler from "../server/DBHandler";
import Run from "../server/models/Run";
import RunInput from "../components/RunInput";
import RunStats from "../components/RunStats";

interface HomeProps {
  runHistory: Run[];
  stats: Run;
  watcherStatus: boolean;
}

const Home = ({ runHistory, stats, watcherStatus }: HomeProps) => (
  <Layout>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">BRC AutoRun</h1>
          <h2 className="subtitle">
            <div> Management System</div>
            <div
              style={{ color: watcherStatus ? "green" : "red" }}
              className="status"
            >
              Watcher Status: {watcherStatus ? "Online" : "Offline"}
            </div>
          </h2>
        </div>
      </div>
    </section>
    <div className="cards columns">
      <div className="column is-one-half ">
        <RunInput />
      </div>
      <div className="column is-one-half ">
        <RunStats {...stats} />
      </div>
    </div>
    <div className="cards column">
      <RunHistory runs={runHistory} />
    </div>
    <style jsx>
      {`
        .status {
          border-radius: 25px;
          margin: 10px auto;
          margin-left: 0;
          margin-bottom: 0;
          width: 250px;
          padding: 10px 20px;
          background-color: white;
          text-align: center;
        }
        .cards {
          margin: auto;
          width: 80%;
        }
        @media (width < 769px) {
          .cards {
            width: 100%;
          }
          .status {
            margin: auto;
            margin-top: 20px;
          }
        }
        .cards > * {
          min-height: 200px;
          margin: auto;
        }
      `}
    </style>
  </Layout>
);

Home.getInitialProps = async ({ req }) => {
  const dbHandler = (req as any).db as dbHandler;
  const runHistory = await dbHandler.GetRunHistory();
  const stats = await dbHandler.GetLatestRun();
  const watcherStatus = await dbHandler.getWatcherStatus();
  return { runHistory, stats, watcherStatus };
};

export default Home;
