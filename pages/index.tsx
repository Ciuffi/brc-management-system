import { NextPage } from "next";
import Layout from "../components/Layout";
import RunHistory from "../components/RunHistory";
const Home: NextPage = () => (
  <Layout>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">BRC AutoRun</h1>
          <h2 className="subtitle">Management System</h2>
        </div>
        <RunHistory />
      </div>
    </section>
  </Layout>
);

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] || "" : navigator.userAgent;
  return { userAgent };
};

export default Home;
