import "./ImageAnalysis.css";

const ImageAnalysis = ({ description }) => {
  return (
    <div className="image-analysis">
      <h2>{description.title}</h2>

      <p className="analysis-description">{description.description}</p>

      <div className="analysis-details">
        {description.details.map((detail, index) => (
          <div className="detail" key={index}>
            <span>•</span>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageAnalysis;
