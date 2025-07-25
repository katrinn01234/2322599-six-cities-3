import { CityName } from '../../const';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

type MainEmptyProps = {
  cityName: CityName;
};

function MainEmpty({ cityName }: MainEmptyProps): JSX.Element {
  return (
    <div className="cities">
      <div className="cities__places-container cities__places-container--empty container">
        <section className="cities__no-places">
          <div className="cities__status-wrapper tabs__content">
            <b className="cities__status">No places to stay available</b>
            <p className="cities__status-description">
              We could not find any property available at the moment in {cityName}
            </p>
          </div>
          <Link
            to={AppRoute.Root}
            className="cities__status-link"
          >
            Try another city
          </Link>
        </section>
        <div className="cities__right-section">
          <div className="cities__no-places-map">
            <img
              src="img/no-places.png"
              alt="No places available"
              width="800"
              height="600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainEmpty;
