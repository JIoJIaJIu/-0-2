# MomAndPop

## Assembly frontend

* npm install
* gulp desktop

or

* gulp mobile

### Dependencies:

* gulp (npm install -g gulp)

## Starting server (proxy to 3 servers)

* cd server
* ./setup.sh
* npm install
* node server.js
* open http://localhost:8000 (by default)

### Dependencies

* Should be started mongod on :27017
* Should be opened 3000, 3003, 10100 for 3 servers

##Notice

* isBusinessHoursPublic and etc only for unauthorized users?
* Mismatch description object in tuml (GiftCardOffer) and in REST_API_SPEC
* No price for GiftCardOffer
* In comments user ids are shown, because getting usernames for each comment is too expencive. And there are not user names in comment data
* how to implement HomeCtrl.emailToFriend ?
