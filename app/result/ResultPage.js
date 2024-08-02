import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Carousel } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import loadGif from '../../public/load.gif';
import RatingBar from './../../components/RatingBar/RatingBar'; // Import the RatingBar component

// Use dynamic import for Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const ResultPage = (props) => {
  const { Laptop_name, Rating, Total_Reviews, Images, Price, graph, price_graph, Product_URL, ...specs } = props;
  const [showComparisonChart, setShowComparisonChart] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (graph || price_graph) {
      setLoading(false);
    }
  }, [graph, price_graph]);

  const imageUrls = Images.split(' | ');
  const rating = parseFloat(Rating);
  const totalReviews = parseFloat(Total_Reviews);

  return (
    <div className="page2">
      <div className="dabba1">
        <div className="laptop">
          <div className="laptopinfo">
            <div className="laptopimg flex">
              <Carousel>
                {imageUrls.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={url}
                      alt={`Slide ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="laptopbox">
            <div className="laptopname">{Laptop_name}</div>
          </div>
        </div>
        <div className="user_ratings">
          <div className="buylinks">
            <Link href={Product_URL} target="_blank">
              <img src="https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg" alt="Buy Now" />
            </Link>
          </div>
          <div className="overall_rating">
            <RatingBar rating={rating} />
            <div className="rating-value">{rating.toFixed(1)}/5</div>
          </div>
          <div className="total_reviews">
            Total Reviews
            <br />
            {totalReviews} reviews
          </div>
        </div>
      </div>
      <div className="dabba2">
        <h3 className="spec-sheet-heading">SPECIFICATION SHEET</h3>
        <div className="spec_sheet">
          <ul>
            <li className="_flx">
              <div className="_thumb">
                <span className="_ttl">Price:</span>
              </div>
              <div className="_pdsd">
                <span className="_vltxt">{Price}</span>
              </div>
            </li>
            {Object.keys(specs).map((key) => (
              <li className="_flx" key={key}>
                <div className="_thumb">
                  <span className="_ttl">{`${key}:`}</span>
                </div>
                <div className="_pdsd">
                  <span className="_vltxt">{specs[key]}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="dabba3">
        <div className="toggle-switch">
          <button onClick={() => setShowComparisonChart(true)} className={showComparisonChart ? 'active' : ''}>Comparison Chart</button>
          <button onClick={() => setShowComparisonChart(false)} className={!showComparisonChart ? 'active' : ''}>Price History</button>
        </div>
        {showComparisonChart ? (
          <div className="comparisonchart">
            {loading ? (
              <div className="loading-animation">
                <Image src={loadGif} alt="Loading..." width={100} height={100} unoptimized={true} />
              </div>
            ) : (
              graph && (
                <Plot
                  data={JSON.parse(graph).data}
                  layout={JSON.parse(graph).layout}
                />
              )
            )}
          </div>
        ) : (
          <div className="pricecomparisonchart">
            {loading ? (
              <div className="loading-animation">
                <Image src={loadGif} alt="Loading..." width={100} height={100} unoptimized={true} />
              </div>
            ) : (
              price_graph && (
                <Plot
                  data={JSON.parse(price_graph).data}
                  layout={JSON.parse(price_graph).layout}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
