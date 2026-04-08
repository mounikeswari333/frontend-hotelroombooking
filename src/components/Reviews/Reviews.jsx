import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Reviews.css";

function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment:
        "Excellent stay! The rooms were clean and staff was very helpful.",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      rating: 4,
      comment:
        "Great location and comfortable beds. Would definitely book again!",
    },
    {
      id: 3,
      name: "Anjali Patel",
      rating: 5,
      comment:
        "Outstanding service and beautiful property. Highly recommended!",
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 4,
      comment: "Good value for money with modern amenities and polite staff.",
    },
  ];

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 6000,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const SlickSlider = Slider?.default || Slider;
  const canUseSlick = typeof SlickSlider === "function";

  return (
    <section className="reviews-section">
      <div className="section-header">
        <h2>Guest Reviews</h2>
        <p className="section-subtitle">See what our guests say</p>
      </div>

      <div className="reviews-slider-wrap">
        {canUseSlick ? (
          <SlickSlider {...sliderSettings}>
            {reviews.map((review) => (
              <div key={review.id} className="slide-item">
                <div className="review-card">
                  <div className="review-header">
                    <h4>{review.name}</h4>
                    <div className="review-rating">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} className="star" />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              </div>
            ))}
          </SlickSlider>
        ) : (
          <div className="reviews-fallback-list">
            {reviews.map((review) => (
              <div key={review.id} className="slide-item">
                <div className="review-card">
                  <div className="review-header">
                    <h4>{review.name}</h4>
                    <div className="review-rating">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} className="star" />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Reviews;
