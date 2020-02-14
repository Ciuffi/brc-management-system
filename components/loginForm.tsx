interface LoginFormProps {
  error: boolean;
}

export default ({ error }: LoginFormProps) => (
  <form id="loginForm" className="form" action="/login" method="post">
    <input type="hidden" name="user" value="x" />
    <div className="field">
      <div className="control">
        <input
          className="input is-primary"
          type="password"
          name="pass"
          placeholder="password"
          id="pass"
        />
      </div>
    </div>
    <div className="is-flex-desktop">
      <button type="submit" className="submitButton button is-success">
        Login
      </button>
      {error && (
        <p style={{ color: "red", lineHeight: "2.5em", marginLeft: "2%" }}>
          Incorrect Password
        </p>
      )}
    </div>
  </form>
);
