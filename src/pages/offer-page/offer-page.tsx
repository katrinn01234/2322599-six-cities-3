import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import Map from '../../components/map/map';
import ReviewForm from '../../components/review-form/review-form';
import ReviewsList from '../../components/reviews-list/reviews-list';
import OfferList from '../../components/offer-list/offer-list';
import { getOffers } from '../../store/selectors';
import { AppRoute } from '../../const';
import NotFoundPage from '../not-found-page/not-found-page';

function OfferPage(): JSX.Element {
  const { id } = useParams();
  const offers = useAppSelector(getOffers);
  const navigate = useNavigate();

  const currentOffer = offers.find((offer) => offer.id === id);

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const nearOffers = offers
    .filter((offer) => offer.id !== id && offer.city.name === currentOffer.city.name)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>6 cities. Offer details</title>
      </Helmet>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {currentOffer.images.slice(0, 6).map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img className="offer__image" src={image} alt="Place image" />
                </div>
              ))}
            </div>
          </div>

          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>
                <button
                  className="offer__bookmark-button button"
                  type="button"
                  onClick={() => navigate(AppRoute.Favorites)}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${currentOffer.rating * 20}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{currentOffer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {currentOffer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {currentOffer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {currentOffer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {currentOffer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${currentOffer.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img
                      className="offer__avatar user__avatar"
                      src={currentOffer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                  <span className="offer__user-name">{currentOffer.host.name}</span>
                  {currentOffer.host.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{currentOffer.description}</p>
                </div>
              </div>

              <section className="offer__reviews reviews">
                <h2 className="reviews__title">Reviews · <span className="reviews__amount">0</span></h2>
                <ReviewsList reviews={[]} />
                <ReviewForm />
              </section>
            </div>
          </div>
          <section className="offer__map map">
            <Map
              city={currentOffer.city}
              offers={[currentOffer, ...nearOffers]}
              selectedOfferId={currentOffer.id}
            />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OfferList
              offers={nearOffers}
              block="near-places"
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default OfferPage;
