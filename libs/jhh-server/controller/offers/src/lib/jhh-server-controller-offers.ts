import addOffer from './add-offer';
import editOffer from './edit-offer';
import removeOffers from './remove-offers';

export function JhhServerControllerOffers() {
  return {
    addOffer,
    editOffer,
    removeOffers,
  };
}
