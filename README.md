# Lifty

Lifty is a carpool app for skiers and snowboarders to ride together to resorts. At this time, it is specific to Utah ski resorts and the Great Salt Lake City area. 

# About The Project

This web application serves as a dynamic platform designed to facilitate seamless connections among snowboarders and skiers, enabling them to arrange shared rides to popular ski resorts. The primary objective is to mitigate canyon traffic congestion, alleviate parking challenges, and minimize carbon emissions, all of which are pervasive issues during the winter season at ski resorts. 

Upon creating an account using their email, users gain immediate access to features allowing them to both offer their own rides and secure rides from fellow members of the Lifty community. The inclusion of a group messaging functionality fosters direct communication between passengers and drivers, enhancing coordination and convenience. 

Additionally, each user's profile showcases fun details such as their bio, locality or city, and preferred snow sport(s), whether skiing, snowboarding, or both. Notably, the profile also incorporates a feature that quantifies the environmental impact by providing conversions for the emissions saved, thus offering users a tangible measure of their positive contribution to environmental sustainability.

## See all rides
<img width="1432" alt="Lifty ride page" src="https://github.com/beccajonas/lifty/assets/87732074/7f636bb8-48dc-40c6-b897-b423cbc82ffe">

## Post a ride
<img width="1436" alt="Lifty post a ride page" src="https://github.com/beccajonas/lifty/assets/87732074/225d1b85-b185-4959-ad0f-9e8dcbe53bf5">

## Book a ride with another Lifty member
<img width="1433" alt="Book a ride page" src="https://github.com/beccajonas/lifty/assets/87732074/32ebf129-d24a-4499-9669-d6589eff3fcf">

## Group message your ride-mates
<img width="1435" alt="Group message page" src="https://github.com/beccajonas/lifty/assets/87732074/a2b6226b-cca9-490e-b1bf-d2331e1a816b">

## Customize your profile
<img width="1440" alt="User profile page" src="https://github.com/beccajonas/lifty/assets/87732074/76faa0c8-88d8-4339-aedd-0fddcc3266e3">

## Built With
- React
- Python
- Flask
- Tailwind CSS
- Google Map API

## Running Locally

Requires Python 3.11.
```bash
python3 --version
>> Python 3.11.4
```

Server installation and run. 

```bash
cd server
pipenv install
pipenv shell
python seed.py
python app.py
```

Frontend installation and run. 

```bash
cd client
npm install
npm run dev
```

You will need an API key from Google. You can get that at the link below. Do not share this key with anyone or post to Github.
https://developers.google.com/maps/documentation/javascript/get-api-key

To implement the key, run the following:
```bash
cd server
touch .env
```
In the .env file, type:
```bash
API_KEY=*copy your API key*
```
