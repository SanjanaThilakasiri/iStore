import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RUrBvBBC2Wlbvk78yNM00sIQPHThrEkdnjG7wQblRNqGg4dhUvuSkk5NEc2ramooWqXURaNK5LbUOle9MlyjYu100ONeSqUP1');

export default stripePromise;