1. 
I merged two submission together and almost refact all codes. 

2.
Add REST service for GiftCardOffer.getGiftCardOffers to get offers of given ids.
Add GiftCardService#getByOfferIds

3.
GiftCardService#search for coordinate filter, use same approach of GiftCardOfferService.
Fixed

4.
Add amount parameter to GiftCardService.redeem.
Fixed

5.
Add description parameter to GiftCardService.resell.
Fixed

6.
GiftCard, when save the QRCode, please generate unique name for each request.
Fixed

7.
Add authentication for GiftCardService#redeem
Fixed

8.
GiftCardService#redeem, it should compare the passed amount with giftCard.quantity, not giftCardRedeem.amount
Fixed