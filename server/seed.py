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

        user_list = []
        for user in data['users']:
            u = User(
                email=user.get("email"),
                password_hash=bcrypt.generate_password_hash(user.get('password_hash')),
                first_name=user.get("first_name"),
                last_name=user.get("last_name"),
                profile_pic=user.get("profile_pic"),
                total_distance_traveled=user.get("total_distance_traveled"),
                total_emissions_saved=user.get("total_emissions_saved")
            )
            user_list.append(u)
        db.session.add_all(user_list)
        db.session.commit()
        print("seeding complete!")