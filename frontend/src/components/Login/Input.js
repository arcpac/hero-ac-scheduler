import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Input({ label, id, error, ...props }) {
  return (
    <div className="form-group">
      <label className="label" htmlFor={id}>{label}</label>
      <input className="form-control mt-1" id={id} {...props} />
      <div className="control-error mt-0 mb-3"> {error && <p>{error}</p>} </div>
    </div>
  );
}
