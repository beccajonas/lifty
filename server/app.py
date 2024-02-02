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

# Check session
@app.get("/api/check_session")
def check_session():
    user = db.session.get(User, session.get('user_id'))
    print(f'check session: {user}')
    if user:
        return user.to_dict(rules=['-password']), 200
    else:
        return {"message": "No user logged in."}, 401
    
# Login
@app.post("/api/login")
def login():
    try:
        data = request.json
        user = User.query.filter_by(email=data.get("email")).first()

        if user and bcrypt.check_password_hash(user.password_hash, data.get('password')):
            session["user_id"] = user.id
            print("success")
            return user.to_dict(rules=['-password_hash']), 200
        else:
            if not user:
                return {"error": "User not found. Please try again."}, 404
            else:
                return {"error": "Incorrect password. Please try again."}, 401

    except Exception as e:
        return {"error": str(e)}

# Logout
@app.delete('/api/logout')
def logout():
    session.pop('user_id', None) 
    return { "message": "Logged out"}, 200

# Login
@app.post("/api/signup")
def signup():
    try:
        data = request.json
        print(data)
        existing_user = User.query.filter_by(email=data.get("email")).first()

        if existing_user:
            return {"error": "Email already exists. Please select new email."}, 400
    
        new_user = User(
            email=data.get("email"),
            password_hash=bcrypt.generate_password_hash(data.get("password"))
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(rules=['-password_hash']), 200

    except Exception as e:
        return {"error": str(e)}, 500

@app.get("/api/users")
def get_all_users():
    users = User.query.all()
    return [u.to_dict() for u in users]

@app.get("/api/lots")
def get_all_lots():
    lots = Lot.query.all()
    return [l.to_dict() for l in lots]

@app.get("/api/resorts")
def get_all_resorts():
    resorts = Resort.query.all()
    return [r.to_dict() for r in resorts]

@app.get("/api/users/<int:id>")
def get_user_by_id(id):
    user = db.session.get(User, id)
    return user.to_dict(rules=['-password_hash'])

# Get rides for user 
@app.get("/api/users/<int:user_id>/rides")
def get_rides_by_user(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    rides_as_driver = Ride.query.filter_by(driver_id=user_id).all()
    if not rides_as_driver:
        return {"error": "Ride not found."}
    
    return [r.to_dict() for r in rides_as_driver], 200

@app.get("/api/rides")
def get_rides():
    rides = Ride.query.all()
    return [r.to_dict() for r in rides]

@app.get("/api/rides/<int:id>")
def get_rides_by_id(id):
    ride = db.session.get(Ride, id)
    if not ride:
        return {"error": "ride not found"}
    return ride.to_dict(rules=['-passenger']) 

# Add new ride (POST)
@app.post("/api/users/<int:id>/new_ride")
def post_new_ride(id):
    try:
        data = request.json
        ride = Ride(
            driver_id=data.get("driver_id"),
            lot_id=data.get("lot_id"),
            resort_id=data.get("resort_id"),
            capacity=data.get("capacity")
            )
        if not ride.driver_id:
            return {"error": "Problem finding user info. Try again."},  404
        if not ride.lot_id:
            return {"error": "Please select a Park-And-Ride lot."}, 404
        if not ride.resort_id:
            return {"error": "Please select a resort."}, 404
        if not ride.capacity:
            return {"error": "Select a passenger  capacity for your ride."}, 404
        db.session.add(ride)
        db.session.commit()

        return ride.to_dict(), 201
    
    except Exception as e:
        return {"error": str(e)}

# Add passenger to ride (POST)
@app.post('/api/rides/<int:id>/add_passengers')
def add_passengers_to_ride(id):
    try:
        data = request.json
        ride = db.session.query(Ride).get(id)
        if not ride:
            return {"error": "Ride not found."}, 404
        if len(ride.passengers) >= ride.capacity:
            return jsonify({"error": "Ride is already at full capacity."}), 400
        
        passenger = User.query.get(data['id'])
        if not passenger:
            return jsonify({"error": "Passenger not found."}), 404

        ride.passengers.append(passenger)
        db.session.commit()

        return ride.to_dict(), 200

    except Exception as e:
        return {"error": str(e)}
    
# Remove passenger from ride (DELETE)
@app.delete('/api/rides/<int:ride_id>/remove_passenger/<int:passenger_id>')
def remove_passenger_from_ride(ride_id, passenger_id):
    try:
        ride = Ride.query.get(ride_id)
        if not ride:
            return {"error": "Ride not found."}, 404
        
        passenger = User.query.get(passenger_id)
        if not passenger:
            return {"error": "Passenger not found."}, 404
        
        if passenger in ride.passengers:
            ride.passengers.remove(passenger)
            db.session.commit()
            return ride.to_dict(), 200
        else: 
            return {"error": "Passenger is not in the ride."}, 400
    except Exception as e:
        return {"error": str(e)}
        
# Delete ride (DELETE)
@app.delete("/api/users/<int:driver_id>/rides/<int:ride_id>")
def delete_ride(driver_id, ride_id):
    try:
        ride = Ride.query.get(ride_id)
        if not ride:
            return {"error": "Ride not found."}, 404
        
        driver = User.query.get(driver_id)
        if not driver:
            return {"error": "Driver not found."}, 404
        
        if ride.driver_id != driver_id:
            return {"error": "User is not the driver of the ride."}, 403

        db.session.delete(ride)
        db.session.commit()

        return {"message": "Ride deleted successfully."}, 200

    except Exception as e:
        return {"error": str(e)}
    
    
if __name__ == "__main__":
    app.run(port=5555, debug=True)