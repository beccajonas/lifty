from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime
from models import db, User, Ride, Lot, Resort
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
config = dotenv_values(".env")

app = Flask(__name__)
app.secret_key = config['FLASK_SECRET_KEY']
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

db.init_app(app)

@app.get("/")
def index():
    return "lifty backend"

@app.get("/users")
def get_all_users():
    users = User.query.all()
    return [u.to_dict() for u in users]

@app.get("/users/<int:id>")
def get_user_by_id(id):
    user = db.session.get(User, id)
    return user.to_dict()

# Get rides for user 
@app.get("/users/<int:user_id>/rides")
def get_rides_by_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return {"error": "user not found"}, 404
    
    rides_as_driver = Ride.query.filter_by(driver_id=user_id).all()
    if not rides_as_driver:
        return {"error": "ride not found"}
    
    return [r.to_dict() for r in rides_as_driver], 200

@app.get("/rides")
def get_rides():
    rides = Ride.query.all()
    return [r.to_dict(rules=['-driver', '-passenger']) for r in rides]

@app.get("/rides/<int:id>")
def get_rides_by_id(id):
    ride = db.session.get(Ride, id)
    if not ride:
        return {"error": "ride not found"}
    return ride.to_dict(rules=['-driver', '-passenger']) 

# Add new ride (POST)
@app.post("/users/<int:id>/new_ride")
def post_new_ride(id):
    try:
        data = request.json
        ride = Ride(
            driver_id=data.get("driver_id"),
            lot_id=data.get("lot_id"),
            resort_id=data.get("resort_id"),
            capacity=data.get("capacity")
            )
        db.session.add(ride)
        db.session.commit()

        return ride.to_dict(), 201
    
    except Exception as e:
        return {"error": str(e)}

# Add passenger to ride (POST)
@app.post('/rides/<int:id>/add_passengers')
def add_passengers_to_ride(id):
    try:
        data = request.json
        ride = db.session.get(Ride, id)
        if not ride:
            return {"error": "ride not found"}
        if len(ride.passengers) >= ride.capacity:
            return jsonify({"error": "Ride is already at full capacity"}), 400
        
        passenger = User.query.get(data['id'])
        if not passenger:
            return jsonify({"error": "Passenger not found"}), 404

        ride.passengers.append(passenger)
        db.session.commit()

        return ride.to_dict(), 200

    except Exception as e:
        return {"error": str(e)}
    
# Remove passenger from ride (DELETE)
@app.delete('/rides/<int:ride_id>/remove_passenger/<int:passenger_id>')
def remove_passenger_from_ride(ride_id, passenger_id):
    try:
        ride = Ride.query.get(ride_id)
        if not ride:
            return {"error": "Ride not found"}, 404
        
        passenger = User.query.get(passenger_id)
        if not passenger:
            return {"error": "Passenger not found"}, 404
        
        if passenger in ride.passengers:
            ride.passengers.remove(passenger)
            db.session.commit()
            return ride.to_dict(), 200
        else: 
            return {"error": "Passenger is not in the ride"}, 400
    except Exception as e:
        return {"error": str(e)}
        
# Delete ride (DELETE)
@app.delete("/users/<int:driver_id>/rides/<int:ride_id>")
def delete_ride(driver_id, ride_id):
    try:
        ride = Ride.query.get(ride_id)
        if not ride:
            return {"error": "Ride not found"}, 404
        
        driver = User.query.get(driver_id)
        if not driver:
            return {"error": "Driver not found"}, 404

        # Check if the specified driver is the actual driver of the ride
        if ride.driver_id != driver_id:
            return {"error": "User is not the driver of the ride"}, 403

        # Delete the ride
        db.session.delete(ride)
        db.session.commit()

        return {"message": "Ride deleted successfully"}, 200

    except Exception as e:
        return {"error": str(e)}
    
    
if __name__ == "__main__":
    app.run(port=5555, debug=True)