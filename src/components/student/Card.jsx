import PropTypes from 'prop-types';

function Card(props) {
  return (
    <div className="border rounded-lg shadow-sm bg-white w-full max-w-xs overflow-hidden flex flex-col h-full">
      <img
        className="w-full h-48 object-cover"
        alt="Card Image"
        src={props.img}
      />

      <div className="p-4 flex flex-col flex-1">
        <h2 className="font-bold text-lg mb-2">{props.title}</h2>
        <p className="text-sm text-gray-600 mb-2">{props.date}</p>

        <span className="inline-block px-4 py-1 bg-red-100 text-black rounded-full mb-2">
          {props.type}
        </span>

        <p className="text-sm text-gray-500 mb-2">
          <i className="fa-solid fa-location-dot text-gray-500 mr-1"></i>
          {props.location}
        </p>

        <div className="flex justify-between mt-auto">
          <button className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600 transition">
            Register
          </button>
          <button className="border px-3 py-1 rounded text-sm bg-white text-indigo-500 hover:bg-indigo-50 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default Card;
