const Card = ({ children }) => {
    return <div className="card bg-base-100 shadow-xl p-4">{children}</div>;
  };
  
  const CardContent = ({ children }) => {
    return <div className="card-body">{children}</div>;
  };
  
  export { Card, CardContent };
  