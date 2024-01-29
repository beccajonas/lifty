from app import app
from models import db, User, Ride, Lot, Resort, passenger_ride_association
import json
from flask_bcrypt import Bcrypt

if __name__ == "__main__":
    with app.app_context():
        bcrypt = Bcrypt(app)
        data = {}
        with open("db.json") as f:
            data = json.load(f)
        print("clearing data...")
        db.session.query(User).delete()
        db.session.query(Ride).delete()
        db.session.query(Lot).delete()
        db.session.query(Resort).delete()
        db.session.query(passenger_ride_association).delete()

        for lots in data['lots']:
            db.session.add(Lot(**lots))

        for resorts in data['resorts']:
            db.session.add(Resort(**resorts))

        for users in data['users']:
            db.session.add(User(**users))

        db.session.commit()
        print("seeding complete!")