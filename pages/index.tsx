import Layout from "../components/Layout";
import RunHistory from "../components/RunHistory";
import DBHandler from "../server/DBHandler";
import Run from "../server/models/Run";
import RunInput from "../components/RunInput";
import RunStats from "../components/RunStats";
import "../styles/index.scss";
interface HomeProps {
  runHistory: Run[];
  stats: Run;
  watcherStatus: boolean;
}

const Home = ({ runHistory, stats, watcherStatus }: HomeProps) => (
  <Layout>
    <section className="hero is-info">
      <a href="/logout">
        <button className="button is-danger" id="logoutButton">
          Logout
        </button>
      </a>
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
  </Layout>
);

Home.getInitialProps = async ({ req }) => {
  const dbHandler = (req as any).db as DBHandler;
  const runHistory = await dbHandler.GetRunHistory();
  const stats = await dbHandler.GetLatestRun();
  const watcherStatus = await dbHandler.getWatcherStatus();
  return { runHistory, stats, watcherStatus };
};

export default Home;
