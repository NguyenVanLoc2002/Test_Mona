const Button = ({ children, onClick, color = "primary",className = "" }) => {
    return (
      <button className={`btn btn-${color}  ${className}`} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  export { Button };
  