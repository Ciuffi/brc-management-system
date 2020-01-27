import Layout from "../components/Layout";
import RunHistory from "../components/RunHistory";
import dbHandler from "../server/DBHandler";
import Run from "../server/models/Run";
import RunInput from "../components/RunInput";
import RunStats from "../components/RunStats";

interface HomeProps {
  runHistory: Run[];
  stats: Run;
}

const Home = ({ runHistory, stats }: HomeProps) => (
  <Layout>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">BRC AutoRun</h1>
          <h2 className="subtitle">Management System</h2>
        </div>
      </div>
    </section>
    <div className="cards container is-flex">
      <RunInput />
      <RunStats {...stats} />
    </div>
    <RunHistory runs={runHistory} />
  </Layout>
);

Home.getInitialProps = async ({ req }) => {
  const dbHandler = (req as any).db as dbHandler;
  const runHistory = await dbHandler.GetRunHistory();
  const stats = await dbHandler.GetLatestRun();
  return { runHistory, stats };
};

export default Home;
