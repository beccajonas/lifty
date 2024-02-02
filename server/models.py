from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string, datetime

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

    serialize_rules =['-driver.rides_as_passenger', 
                      '-passengers.rides_as_passenger',
                      '-passengers.rides_as_driver']

    id = db.Column(db.Integer, primary_key=True)
    capacity = db.Column(db.Integer, nullable=False)
    passengers = db.relationship('User', secondary=passenger_ride_association, back_populates='rides_as_passenger')

    driver_id = db.Column(db.Integer, db.ForeignKey('user_table.id'), nullable=False)
    lot_id = db.Column(db.Integer, db.ForeignKey('lot_table.id'), nullable=False)
    resort_id = db.Column(db.Integer, db.ForeignKey('resort_table.id'), nullable=False)
    # date_time = db.Column(db.DateTime)
    # emissions_saved_data = db.Column(db.Float)
    # distance_traveled = db.Column(db.Float)
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

