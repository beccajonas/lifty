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
    data = request.json
    ride = Ride(
        driver_id=data.get("driver_id"),
        passenger_id=data.get("passenger_id"), 
        lot_id=data.get("lot_id"),
        resort_id=data.get("resort_id")
        )
    db.session.add(ride)
    db.session.commit()

    return ride.to_dict(rules=['-driver', '-driver.id', '-passenger.rides_as_driver']), 201


@app.patch("/rides/<int:id>")
def patch_accept_ride(id):
    ride = db.session.get(Ride, id)
    try:
        data = request.json
        for key in data:
            setattr(ride, key, data[key])
        db.session.add(ride)
        db.session.commit()
    except Exception as e:
        return {"error": str(e)}, 422
    return ride.to_dict(rules=['-driver', '-passenger'])

if __name__ == "__main__":
    app.run(port=5555, debug=True)