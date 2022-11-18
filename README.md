Steps:
composer i
npm i 
mv .env.example .env (same as cockroachdb)
php artisan key:generate

Run:
npx hardhat run --network localhost scripts/deploy.js (to get the contractAddress)

Go to /resources/js/Authentication.sol/Authentication.json 
Add:
"networks" : {"1337": {
    "address" : "contactAddyHere"
}}

Run:(separate terminals)
nodemon resources/js/server.js
npm run dev
php artisan serve
npx hardhat node