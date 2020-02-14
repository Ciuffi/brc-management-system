import Head from "next/head";
import Link from "next/link";
import "../styles/styles.sass";
import { ReactChild } from "react";

interface LayoutProps {
  children: ReactChild[] | ReactChild;
}

export default ({ children }: LayoutProps) => {
  /*
   * Added this to toggle the is-active class. See:
   *
   * https://bulma.io/documentation/components/navbar/#navbar-menu
   * https://github.com/jgthms/bulma/issues/856
   */
  const toggleStyles = () => {
    document?.querySelector("#burger")?.classList.toggle("is-active");
    document?.querySelector("#navbarmenu")?.classList.toggle("is-active");
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Head>
        <title>BRC Database</title>
      </Head>
      <div style={{ paddingBottom: "30vh", height: "100%" }}> {children}</div>
      <footer className="footer has-text-centered-mobile">
        <span>Created by Giulio Rossi</span>
        <br></br>
        <span>
          If you need assistance in any way, please contact me @{" "}
          <a href="mailto:ciuffi9@mac.com?subject=BMS support">
            ciuffi9@mac.com
          </a>
        </span>
      </footer>
      <style jsx>{`
        footer {
          position: absolute;
          bottom: 0;
          background-color: lightgrey;
          padding: 1rem 1.5rem 2rem;
          width: 100vw;
        }
      `}</style>
    </div>
  );
};
