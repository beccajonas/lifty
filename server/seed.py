from app import app
from models import db, User, Ride, Lot, Resort
import json
from flask_bcrypt import Bcrypt

if __name__ == "__main__":
    with app.app_context():
        bcrypt = Bcrypt(app)
        data = {}
        with open("db.json") as f:
            data = json.load(f)
        print("clearing data...")
        User.query.delete()
        Ride.query.delete()
        Lot.query.delete()
        Resort.query.delete()

        print("seeding data...")

        for resort_data in data['resorts']:
            db.session.add(Resort(**resort_data))
        
        for lot_data in data['lots']:
            db.session.add(Lot(**lot_data))

        for user_data in data['users']:
            db.session.add(User(**user_data))
        
        for ride_data in data['rides']:
            db.session.add(Ride(**ride_data))
    
        db.session.commit()
        print("seeding complete!")