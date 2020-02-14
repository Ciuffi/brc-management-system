import "../styles/login.scss";
import Layout from "../components/Layout";
import LoginForm from "../components/loginForm";
import { NextPageContext } from "next";

interface loginProps {
  error: boolean;
  basePath: string;
}

const Login = ({ basePath, error }: loginProps) => (
  <Layout>
    <section className="hero is-info">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">BRC AutoRun</h1>
          <h2 className="subtitle">
            <div> Management System</div>
          </h2>
        </div>
      </div>
    </section>
    <div id="mainDiv">
      <article id="loginCard" className="message">
        <div className="message-header">
          <p>Login</p>
        </div>
        <div className="message-body">
          <div className="intro">
            Please login with your lab's shared password. <br />
          </div>
          <LoginForm basePath={basePath} error={error} />
          <div className="intro" style={{ marginTop: "2%" }}>
            If you have any issues logging in, please contact Giulio Rossi @{" "}
            <a href="mailto:ciuffi9@mac.com?subject=BMS support">
              ciuffi9@mac.com
            </a>{" "}
            for assistance.
          </div>
        </div>
      </article>
    </div>
  </Layout>
);

Login.getInitialProps = (context: NextPageContext) => {
  const basePath = (context.req as any).dev ? "" : "/bms";
  return {
    basePath,
    error: context.req.headers.referer?.endsWith("/login") ?? false
  };
};

export default Login;
