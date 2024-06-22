const Button = ({ label, onClick }) => {
  return (
    <div>
      <button
        className="bg-rose-600 px-5 py-2 rounded-md border border-black hover:border-l-4 hover:border-b-4 transition-all duration-300"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
