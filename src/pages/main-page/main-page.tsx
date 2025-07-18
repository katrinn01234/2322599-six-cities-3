import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Map } from '../../components/map/map';
import { useAppDispatch, useAppSelector } from '../../hooks';
import OfferList from '../../components/offer-list/offer-list';
import { CitiesList } from '../../components/cities-list/cities-list';
import { SortingOptions } from '../../components/sorting-options/sorting-options';
import { getCurrentCityName, getOffersError, getCurrentCityOffers } from '../../store/data-process/selectors';
import { changeCity, resetOffersError } from '../../store/data-process/data-process';
import { CityName, CITIES, DEFAULT_CITY } from '../../const';
import type { SortOption } from '../../components/sorting-options/sorting-options';
import MainEmpty from '../main-page/main-empty';
import { fetchOffers } from '../../store/api-actions';
import { toast } from 'react-toastify';

function MainPage(): JSX.Element {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<SortOption>('Popular');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const currentCityName = useAppSelector(getCurrentCityName);
  const currentCityOffers = useAppSelector(getCurrentCityOffers);
  const offersError = useAppSelector(getOffersError);

  const validCityName: CityName =
    CITIES.includes(currentCityName as CityName)
      ? currentCityName as CityName
      : DEFAULT_CITY;

  const isEmpty = offersError || currentCityOffers.length === 0;

  useEffect(() => {
    if (!CITIES.includes(currentCityName as CityName)) {
      dispatch(changeCity(DEFAULT_CITY));
    }
  }, [dispatch, currentCityName]);

  useEffect(() => {
    if (offersError) {
      toast.error('Failed to load offers. Please try again later.');
    }
  }, [offersError]);

  const sortedOffers = useMemo(() => {
    const offersCopy = [...currentCityOffers];

    switch (currentSort) {
      case 'Price: low to high':
        return offersCopy.sort((a, b) => a.price - b.price);

      case 'Price: high to low':
        return offersCopy.sort((a, b) => b.price - a.price);

      case 'Top rated first':
        return offersCopy.sort((a, b) => b.rating - a.rating);

      case 'Popular':
      default:
        return offersCopy;
    }
  }, [currentCityOffers, currentSort]);

  const handleCityChange = (city: CityName) => {
    setActiveOfferId(null);
    dispatch(changeCity(city));
    setIsSortMenuOpen(false);
  };

  const handleCardMouseEnter = (id: string) => {
    setActiveOfferId(id);
  };

  const handleCardMouseLeave = () => {
    setActiveOfferId(null);
  };

  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option);
    setIsSortMenuOpen(false);
  };

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  const handleRetryClick = () => {
    dispatch(resetOffersError());
    dispatch(fetchOffers());
  };

  const currentCity = currentCityOffers.length > 0
    ? currentCityOffers[0].city
    : {
      name: validCityName,
      location: {
        latitude: 48.85661,
        longitude: 2.351499,
        zoom: 12
      }
    };

  if (offersError) {
    return (
      <div className="page page--gray page--main">
        <main className="page__main page__main--index page__main--index-empty">
          <div className="cities">
            <div className="cities__places-container cities__places-container--empty container">
              <section className="cities__no-places">
                <div className="cities__status-wrapper tabs__content">
                  <b className="cities__status">Server Error</b>
                  <p className="cities__status-description">
                    Failed to load offers. Please try again later.
                  </p>
                  <button
                    className="cities__retry-button button"
                    onClick={handleRetryClick}
                  >
                    Try again
                  </button>
                </div>
              </section>
              <div className="cities__right-section"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>6 cities. Choose your perfect place to stay</title>
      </Helmet>

      <main className={`page__main page__main--index${isEmpty ? ' page__main--index-empty' : ''}`}>
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList
            currentCity={validCityName}
            onCityChange={handleCityChange}
          />
        </div>

        {isEmpty ? (
          <MainEmpty cityName={validCityName} />
        ) : (
          <div className="cities">
            <div className="cities__places-container container">
              <section className="cities__places places">
                <h2 className="visually-hidden">Places</h2>
                <b className="places__found">
                  {sortedOffers.length} {sortedOffers.length === 1 ? 'place' : 'places'} to stay in {validCityName}
                </b>

                <SortingOptions
                  currentOption={currentSort}
                  onOptionChange={handleSortChange}
                  isOpen={isSortMenuOpen}
                  onToggleMenu={toggleSortMenu}
                />

                <div className="cities__places-list places__list tabs__content">
                  <OfferList
                    offers={sortedOffers}
                    onCardMouseEnter={handleCardMouseEnter}
                    onCardMouseLeave={handleCardMouseLeave}
                    block="cities"
                  />
                </div>
              </section>
              <div className="cities__right-section">
                <section className="cities__map map">
                  <Map
                    city={currentCity}
                    offers={currentCityOffers}
                    selectedOfferId={activeOfferId || undefined}
                  />
                </section>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default MainPage;
