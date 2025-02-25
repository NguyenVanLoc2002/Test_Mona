const Table = ({ children }) => {
    return <table className="table w-full">{children}</table>;
  };
  
  const TableHeader = ({ children }) => {
    return <thead className="bg-base-200 text-lg">{children}</thead>;
  };
  
  const TableRow = ({ children , className=""}) => {
    return <tr className={`${className}`}>{children}</tr>;
  };
  
  const TableCell = ({ children, className = "" }) => {
    return <td className={`border p-2 ${className}`}>{children}</td>;
  };
  
  export { Table, TableHeader, TableRow, TableCell };
  