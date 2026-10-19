import { modelDetails } from './modelProfiles';

export function ModelDetails({ modelId }: { modelId: string }) {
  const details = modelDetails[modelId];
  return <section className="panel details-panel" aria-labelledby="details-heading">
    <div className="details-header">
      <h2 id="details-heading">Model Details</h2>
      <p>Features &amp; recommendations</p>
    </div>
    <div className="details-scroll" key={modelId}>
      <img className="primary-preview" src={details.primary.src} alt={details.primary.alt} />
      <div className="model-article">
        <h3>{details.name}</h3>
        <p className="model-description">{details.description}</p>
        <p className="model-source">Released Date: {details.releasedOn}</p>
        <div className="feature-section">
          <h4>KEY FEATURES</h4>
          <ul className="feature-chips">{details.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
        </div>
        <div className="recommendation-section">
          <h4>RECOMMENDED FOR</h4>
          <p>{details.recommendedFor}</p>
        </div>
      </div>
      <div className="secondary-preview">
        <img src={details.secondary.src} alt={details.secondary.alt} loading="lazy" />
        <div className="preview-fade" />
      </div>
    </div>
  </section>;
}
