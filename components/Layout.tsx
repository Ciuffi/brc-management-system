import Head from "next/head";
import Link from "next/link";
import "../styles/styles.sass";
import { ReactChild } from "react";

interface LayoutProps {
  children: ReactChild[];
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
    <div>
      <Head>
        <title>BRC Database</title>
      </Head>
      {children}
      <footer className="footer">
        <div className="content has-text-centered">
          <span>I'm the footer</span>
        </div>
      </footer>
    </div>
  );
};
