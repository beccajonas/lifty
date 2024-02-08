from app import app
from models import db, User, Ride, Lot, Resort, Group, GroupMembership, Message
import json
from datetime import datetime 
from flask_bcrypt import Bcrypt
from googlemaps import Client
from dotenv import load_dotenv
import os
import re

load_dotenv()
api_key = os.getenv('API_KEY')

if __name__ == "__main__":
    with app.app_context():
        bcrypt = Bcrypt(app)
        data = {}
        with open("db.json") as f:
            data = json.load(f)
        print("Clearing data...")
        db.session.query(User).delete()
        db.session.query(Ride).delete()
        db.session.query(Lot).delete()
        db.session.query(Resort).delete()
        db.session.query(Group).delete()
        db.session.query(GroupMembership).delete()
        db.session.query(Message).delete()

        for lots in data['lots']:
            db.session.add(Lot(**lots))

        for resorts in data['resorts']:
            db.session.add(Resort(**resorts))

        ride_list = []
        for ride_data in data['rides']:
            ride = Ride(
                capacity=ride_data.get('capacity'),
                driver_id=ride_data.get('driver_id'),
                lot_id=ride_data.get('lot_id'),
                resort_id=ride_data.get('resort_id'),
                date_time=datetime.strptime(ride_data.get('date_time'), "%Y-%m-%dT%H:%M:%S"),
                roundtrip=ride_data.get('roundtrip'),
                mpg=ride_data.get('mpg')
            )

            # Retrieve Lot and Resort instances
            lot = Lot.query.get(ride_data.get('lot_id'))
            resort = Resort.query.get(ride_data.get('resort_id'))

            if lot and resort:
                # Calculate distance traveled
                lot_coordinates_str = f"{lot.latitude},{lot.longitude}"
                resort_coordinates_str = f"{resort.latitude},{resort.longitude}"

                try:
                    distance_miles = Ride.calculate_distance(api_key, lot_coordinates_str, resort_coordinates_str)
                    ride.distance_traveled = round(distance_miles, 2)
                    
                    # Adjust distance based on roundtrip attribute
                    if ride.roundtrip:
                        ride.distance_traveled *= 2

                    # Calculate emissions saved
                    ride.set_emissions_saved()
                    ride_list.append(ride)

                except ValueError as e:
                    print(f"Error calculating distance: {e}")

        db.session.add_all(ride_list)
        db.session.commit()

        # Iterate over the ride instances to create groups and group memberships
        for ride in ride_list:
            try:
                # Create a new group for each ride
                group = Group(group_name=f"Ride Group {ride.id}", timestamp=datetime.now())
                db.session.add(group)
                db.session.commit()

                # Create a group membership for the ride driver
                group_membership_driver = GroupMembership(user_id=ride.driver_id, group_id=group.id)
                db.session.add(group_membership_driver)
                db.session.commit()
            except Exception as e:
                print(f"Error creating group and group membership: {e}")

        db.session.commit()

        user_list = []
        for user in data['users']:
            u = User(
                email=user.get("email"),
                password_hash=bcrypt.generate_password_hash(user.get('password_hash')),
                first_name=user.get("first_name"),
                last_name=user.get("last_name"),
                profile_pic=user.get("profile_pic"),
                total_distance_traveled=user.get("total_distance_traveled"),
                total_emissions_saved=user.get("total_emissions_saved"),
                profile_created=datetime.strptime(user.get('profile_created'), "%Y-%m-%dT%H:%M:%S"),
                bio=user.get("bio"),
                area=user.get("area"),
                skier=user.get("skier"),
                snowboarder=user.get("snowboarder")
            )
            user_list.append(u)
        db.session.add_all(user_list)
        db.session.commit()

        for user in user_list:
            user.calculate_total_distance_traveled()

        db.session.commit()
  

        print("Seeding complete!")

