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

class User(db.Model, SerializerMixin):
    __tablename__ = 'user_table'
    
    serialize_rules = ['-rides_as_driver.driver', '-rides_as_driver.driver_id', '-rides_as_passenger.passenger', '-rides_as_passenger.passenger_id']

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    # first_name = db.Column(db.String)
    # last_name = db.Column(db.String)
    # password = db.Column(db.String, nullable=False)
    # total_distance_traveled = db.Column(db.Float)
    # total_emissions_saved = db.Column(db.Float)

    rides_as_driver = db.relationship('Ride', back_populates='driver')
    rides_as_passenger = db.relationship('Passenger', back_populates='passenger')


class Passenger(db.Model, SerializerMixin):
    __tablename__ = 'passenger_table'
    id = db.Column(db.Integer, primary_key=True)
    passenger_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    ride_id = db.Column(db.Integer, db.ForeignKey('ride_table.id'))

    passenger = db.relationship('User', back_populates='rides_as_passenger')

class Ride(db.Model, SerializerMixin):
    __tablename__ = 'ride_table'

    id = db.Column(db.Integer, primary_key=True)

    driver_id = db.Column(db.Integer, db.ForeignKey('user_table.id'))
    passenger_id = db.Column(db.Integer, db.ForeignKey('passenger_table.passenger_id'))
    lot_id = db.Column(db.Integer, db.ForeignKey('lot_table.id'))
    resort_id = db.Column(db.Integer, db.ForeignKey('resort_table.id'))
    # date_time = db.Column(db.DateTime)
    # emissions_saved_data = db.Column(db.Float)
    # distance_traveled = db.Column(db.Float)

    driver = db.relationship('User', back_populates='rides_as_driver')
    # passenger = db.relationships('Passenger', back_populates='')


class Lot(db.Model, SerializerMixin):
    __tablename__ = 'lot_table'

    id = db.Column(db.Integer, primary_key=True)
    lot_name = db.Column(db.String)
    address = db.Column(db.String)


class Resort(db.Model, SerializerMixin):
    __tablename__ = 'resort_table'

    id = db.Column(db.Integer, primary_key=True)
    resort_name = db.Column(db.String)
    address = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

