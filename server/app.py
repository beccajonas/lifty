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

@app.get("/users/<int:id>/rides-as-driver")
def get_rides_as_driver_for_user(id):
    user = db.session.get(User, id)
    if not user:
        return {"error": "user not found"}
    return [r.to_dict(rules=['-driver', '-passenger']) for r in user.rides_as_driver]

@app.get("/users/<int:id>/rides-as-passenger")
def get_rides_as_passenger_for_user(id):
    user = db.session.get(User, id)
    if not user:
        return {"error": "user not found"}
    return [r.to_dict(rules=['-passenger', '-driver']) for r in user.rides_as_passenger]

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

@app.post("/users/<int:id>/rides-as-driver")
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
    
if __name__ == "__main__":
    app.run(port=5555, debug=True)