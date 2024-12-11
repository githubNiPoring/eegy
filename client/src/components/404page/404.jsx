const NotFound = () => {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-3">404 - Page Not Found</h1>
        <p className="lead">The page you are looking for does not exist.</p>
        <hr className="my-4" />
        <p>
          You can try searching again or returning to the{" "}
          <a href="/">homepage</a>.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
