import { NextPage } from "next";
import Layout from "../components/Layout";
import RunHistory from "../components/RunHistory";
import dbHandler from "../server/DBHandler";
import Run from "../server/models/Run";

interface HomeProps {
  runHistory: Run[];
}

const Home = ({ runHistory }: HomeProps) => (
  <Layout>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">BRC AutoRun</h1>
          <h2 className="subtitle">Management System</h2>
        </div>
      </div>
    </section>
    <RunHistory runs={runHistory} />
  </Layout>
);

Home.getInitialProps = async ({ req }) => {
  const runHistory = await ((req as any).db as dbHandler).GetRunHistory();
  return { runHistory };
};

export default Home;
