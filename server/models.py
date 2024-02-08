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
    
    def calculate_total_distance_traveled(self):
        distance_list = []
        if self.rides_as_driver:
            for ride in self.rides_as_driver:
                distance_list.append(ride.distance_traveled)
        if self.rides_as_passenger:
            for ride in self.rides_as_passenger:
                distance_list.append(ride.distance_traveled)

        total_distance_traveled = sum(distance_list) 
        self.total_distance_traveled = total_distance_traveled

    def calculate_total_emissions_saved(self):
        # Initialize an empty list to store emissions saved from rides
        emissions_saved_list = []

        # Check if the user has rides where they are the driver
        if self.rides_as_driver:
            # Iterate over rides where the user is the driver
            for ride in self.rides_as_driver:
                if ride and ride.emissions_saved is not None:
                    emissions_saved_list.append(ride.emissions_saved)

        # Check if the user has rides where they are a passenger
        if self.rides_as_passenger:
            # Iterate over rides where the user is a passenger
            for ride in self.rides_as_passenger:
                if ride and ride.emissions_saved is not None:
                    emissions_saved_list.append(ride.emissions_saved)

        # Calculate the total emissions saved by summing the values in the list
        total_emissions_saved = sum(emissions_saved_list)

        # Update the user's total_emissions_saved attribute
        self.total_emissions_saved = total_emissions_saved

        
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

    profile_created = db.Column(db.DateTime)
    area = db.Column(db.String)
    bio = db.Column(db.String)
    skier = db.Column(db.Boolean)
    snowboarder = db.Column(db.Boolean)
    
    total_distance_traveled = db.Column(db.Float, default=0.0)
    total_emissions_saved = db.Column(db.Float, default=0.0)
    rides_as_passenger = db.relationship('Ride', secondary=passenger_ride_association, back_populates='passengers')
    rides_as_driver = db.relationship('Ride', back_populates='driver')
    sent_messages = db.relationship('Message', back_populates='sender')
    groups = db.relationship('Group', secondary='group_membership_table', back_populates='members')


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
                      '-driver.password_hash',
                      '-driver.groups',
                      '-passengers.groups']

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

            # Calculate initial distance
            initial_distance_miles = self.calculate_distance(api_key, lot_coordinates_str, resort_coordinates_str)

            # Adjust distance based on roundtrip attribute
            if self.roundtrip:
                self.distance_traveled = round(initial_distance_miles * 2, 1)
            else:
                self.distance_traveled = round(initial_distance_miles, 1)
        
        except Exception as e:
            return str(f"Error: {e}") 

            
    def set_emissions_saved(self):
        try:

            if not self.passengers:
                self.emissions_saved = None
            else:
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
            raise ValueError(f"Error: {e} | Unable to calculate emissions saved.")



    def update_emissions_after_join(self):
        try:
            if not self.passengers:
                self.emissions_saved = None
            else:
                ride_emissions = (self.distance_traveled / self.mpg) * 19.6
                # Assuming 19.6 lbs of CO2 emitted per gallon

                # Calculate emissions if each person drove alone for comparison
                emissions_if_each_person_drove_alone = ride_emissions * (len(self.passengers) + 1)

                # Calculate emissions saved by carpooling per person
                emissions_saved_by_carpooling_per_person = emissions_if_each_person_drove_alone - ride_emissions

                # Set the calculated emissions saved value
                self.emissions_saved = emissions_saved_by_carpooling_per_person

        except Exception as e:
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

class Message(db.Model, SerializerMixin):
    __tablename__ = 'message_table'

    serialize_rules =['-sender', '-group']

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)
    timestamp = db.Column(db.DateTime)
    sender_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group_table.id'))

    sender = db.relationship('User', back_populates='sent_messages')
    group = db.relationship('Group', back_populates='messages')

class Group(db.Model, SerializerMixin):
    __tablename__ = 'group_table'

    serialize_rules =['-messages.group', '-members.groups', 'members.sent_messages']

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String)
    timestamp = db.Column(db.DateTime)

    messages = db.relationship('Message', back_populates='group')
    members = db.relationship('User', secondary='group_membership_table', back_populates='groups')


class GroupMembership(db.Model, SerializerMixin):
    __tablename__ = 'group_membership_table'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group_table.id'))

