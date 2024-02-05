from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime
from googlemaps import Client
from dotenv import load_dotenv
import os
import re

load_dotenv()
api_key = os.getenv('API_KEY')

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)

passenger_ride_association = db.Table(
    'passenger_ride_association',
    db.Column('passenger_id', db.Integer, db.ForeignKey('user_table.id')),
    db.Column('ride_id', db.Integer, db.ForeignKey('ride_table.id')),
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'user_table'
    
    serialize_rules = ['-rides_as_passenger.passenger', 
                       '-rides_as_passenger.passenger_id',
                       '-rides_as_passenger.driver',
                       '-rides_as_driver.driver']

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    profile_pic = db.Column(db.String)
    total_distance_traveled = db.Column(db.Float)
    total_emissions_saved = db.Column(db.Float)
    rides_as_passenger = db.relationship('Ride', secondary=passenger_ride_association, back_populates='passengers')
    rides_as_driver = db.relationship('Ride', back_populates='driver')


class Ride(db.Model, SerializerMixin):
    __tablename__ = 'ride_table'

    @classmethod
    def calculate_distance(cls, api_key, start_coordinates, end_coordinates):
        gmaps = Client(key=api_key)
        try:
            distance_matrix_result = gmaps.distance_matrix(
                origins=start_coordinates,
                destinations=end_coordinates,
                mode="driving",
                units="imperial"  # Use "metric" for kilometers
            )

            distance_text = distance_matrix_result['rows'][0]['elements'][0]['distance']['text']
            numeric_distance = float(re.search(r'\d+(\.\d+)?', distance_text).group())
            return numeric_distance

        except Exception as e:
            raise ValueError(f"Error: {e} | Please enter valid coordinates.")

    serialize_rules =['-driver.rides_as_passenger', 
                      '-passengers.rides_as_passenger',
                      '-passengers.rides_as_driver',
                      '-passengers.password_hash',
                      '-driver.password_hash']

    id = db.Column(db.Integer, primary_key=True)
    capacity = db.Column(db.Integer, nullable=False)
    passengers = db.relationship('User', secondary=passenger_ride_association, back_populates='rides_as_passenger')

    driver_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    lot_id = db.Column(db.Integer, db.ForeignKey('lot_table.id'), nullable=False)
    resort_id = db.Column(db.Integer, db.ForeignKey('resort_table.id'), nullable=False)
    date_time = db.Column(db.DateTime)
    emissions_saved = db.Column(db.Float)
    distance_traveled = db.Column(db.Float)
    mpg = db.Column(db.Float)
    roundtrip = db.Column(db.Boolean, default=False)
    driver = db.relationship('User', back_populates='rides_as_driver')
    lot = db.relationship('Lot', back_populates='rides')
    resort = db.relationship('Resort', back_populates='rides')

    @validates('passengers')
    def validate_passengers(self, key, passenger):
        if len(self.passengers) >= self.capacity:
            raise ValueError("Ride is already at full capacity")
        if passenger.id == self.driver_id:
            raise ValueError("A user cannot be both the driver and a passenger in the same ride")
        return passenger
    
    def set_distance_traveled(self, api_key, Lot, Resort):
        try:
            lot = Lot.query.get(self.lot_id)
            resort = Resort.query.get(self.resort_id)

            lot_coordinates_str = f"{lot.latitude},{lot.longitude}"
            resort_coordinates_str = f"{resort.latitude},{resort.longitude}"

            distance_miles = self.calculate_distance(api_key, lot_coordinates_str, resort_coordinates_str)
            self.distance_traveled = round(distance_miles, 1)
        
        except Exception as e:
            return str(f"error: {e}")
            
    def set_emissions_saved(self):
        try:
            # Check if there are no passengers
            if not self.passengers:
                # If no passengers, set emissions_saved to None
                self.emissions_saved = None
            else:
                # Calculate emissions for the current trip based on distance traveled and car's mpg
                ride_emissions = (self.distance_traveled / self.mpg) * 19.6
                # Assuming 19.6 lbs of CO2 emitted per gallon

                # Calculate emissions if each person drove alone for comparison
                emissions_if_each_person_drove_alone = ride_emissions * (len(self.passengers) + 1)

                # Calculate emissions saved by carpooling per person
                emissions_saved_by_carpooling_per_person = emissions_if_each_person_drove_alone - ride_emissions

                # Set the calculated emissions saved value
                self.emissions_saved = emissions_saved_by_carpooling_per_person
                #lbs of carbon

        except Exception as e:
            # Raise a ValueError with an error message if an exception occurs during the calculation
            raise ValueError(f"Error: {e} | Unable to calculate emissions saved.")



    def update_emissions_after_join(self):
        try:
            # Check if there are no passengers
            if not self.passengers:
                # If no passengers, set emissions_saved to None
                self.emissions_saved = None
            else:
                # Calculate emissions for the current trip based on distance traveled and car's mpg
                ride_emissions = (self.distance_traveled / self.mpg) * 19.6
                # Assuming 19.6 lbs of CO2 emitted per gallon

                # Calculate emissions if each person drove alone for comparison
                emissions_if_each_person_drove_alone = ride_emissions * (len(self.passengers) + 1)

                # Calculate emissions saved by carpooling per person
                emissions_saved_by_carpooling_per_person = emissions_if_each_person_drove_alone - ride_emissions

                # Set the calculated emissions saved value
                self.emissions_saved = emissions_saved_by_carpooling_per_person
                # lbs of carbon

        except Exception as e:
            # Raise a ValueError with an error message if an exception occurs during the calculation
            raise ValueError(f"Error: {e} | Unable to update emissions after joining.")

            
class Lot(db.Model, SerializerMixin):
    __tablename__ = 'lot_table'

    serialize_rules =['-rides']

    id = db.Column(db.Integer, primary_key=True)
    lot_name = db.Column(db.String)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    rides = db.relationship('Ride', back_populates='lot')


class Resort(db.Model, SerializerMixin):
    __tablename__ = 'resort_table'

    serialize_rules =['-rides']

    id = db.Column(db.Integer, primary_key=True)
    resort_name = db.Column(db.String)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    logo=db.Column(db.String)

    rides = db.relationship('Ride', back_populates='resort')

