from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from models import db, User, Ride, Lot, Resort, Group, GroupMembership, Message
from flask_cors import CORS
from dotenv import dotenv_values
from flask_bcrypt import Bcrypt
import boto3
from botocore.exceptions import NoCredentialsError
config = dotenv_values(".env")

app = Flask(__name__)
app.secret_key = config['FLASK_SECRET_KEY']
app.api_key = config['API_KEY']
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['FLASKS3_BUCKET_NAME'] = config['FLASKS3_BUCKET_NAME']
app.json.compact = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

db.init_app(app)

AWS_ACCESS_KEY = config['AWS_ACCESS_KEY_ID']
AWS_REGION = config['AWS_REGION']
AWS_SECRET_KEY = config['AWS_SECRET_KEY']
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

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
            password_hash=bcrypt.generate_password_hash(data.get("password")),
            first_name=data.get("first_name"),
            last_name=data.get("last_name")
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user.to_dict(rules=['-password_hash']), 200

    except Exception as e:
        return {"error": str(e)}, 500

@app.get("/api/users")
def get_all_users():
    users = User.query.all()
    return [u.to_dict(rules=['-password_hash']) for u in users]

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
    return [r.to_dict(rules=['-driver.rides_as_driver']) for r in rides]

@app.get("/api/rides/<int:id>")
def get_rides_by_id(id):
    ride = db.session.get(Ride, id)
    if not ride:
        return {"error": "ride not found"}
    return ride.to_dict(rules=['-passenger']) 

@app.patch("/api/rides/<int:id>")
def patch_ride(id):
    try:
        data = request.json
        ride = db.session.get(Ride, id)

        for key in data:
            setattr(ride, key, data[key])

        db.session.add(ride)
        db.session.commit()

        return ride.to_dict(rules=['-passenger']), 201 

    except Exception as e:
        return {"error": str(e)}, 500

# Add new ride (POST)
@app.post("/api/users/<int:id>/new_ride")
def post_new_ride(id):
    try:
        data = request.json
        date_time_str = data.get("date_time")
        date_time_converted = datetime.strptime(date_time_str, "%Y-%m-%dT%H:%M")
        
        ride = Ride(
            driver_id=data.get("driver_id"),
            lot_id=data.get("lot_id"),
            resort_id=data.get("resort_id"),
            capacity=data.get("capacity"),
            date_time=date_time_converted,
            roundtrip=data.get("roundtrip"),
            mpg=data.get("mpg")
        )
        
        if not ride.driver_id or not ride.lot_id or not ride.resort_id or \
                not ride.capacity or not ride.date_time:
            return {"error": "Invalid ride parameters. Please provide all required information."}, 404
        
        # Fetch Lot and Resort instances based on lot_id and resort_id
        try:
            lot = Lot.query.get(ride.lot_id)
            resort = Resort.query.get(ride.resort_id)
        except Exception as e:
            return {"error": f"Error retrieving Lot or Resort: {e}"}, 500

        # Set distance traveled
        try:
            ride.set_distance_traveled(app.api_key, lot, resort)
        except ValueError as ve:
            return {"error": str(ve)}, 500
        
        if ride.distance_traveled is None:
            return {"error": "Distance calculation failed or returned null value."}, 500
        
        db.session.add(ride)
        db.session.commit()
        
        # Set emissions saved
        try: 
            ride.set_emissions_saved()
        except ValueError as ve:
            return {"error": str(ve)}, 500
        
        db.session.add(ride)
        db.session.commit()
        
        # Add the driver to the group membership
        try:
            group = Group(group_name=f"Ride Group {ride.id}", timestamp=datetime.now())
            db.session.add(group)
            db.session.commit()
        except Exception as e:
            return {"error": f"Error creating group: {e}"}, 500
            
        try:
            group_membership_driver = GroupMembership(user_id=ride.driver_id, group_id=group.id)
            db.session.add(group_membership_driver)
        except Exception as e:
            return {"error": f"Error adding driver to group membership: {e}"}, 500

        db.session.commit()

        try:
            driver_user = User.query.get(ride.driver_id)
            driver_user.calculate_total_distance_traveled()
            db.session.commit()
        except Exception as e:
            return {"error": f"Error updating total distance traveled for user: {e}"}, 500


        return ride.to_dict(rules=['-driver', '-passengers']), 201
    
    except Exception as e:
        return {"error": str(e)}, 500
    
'''
'
'
MESSAGING FUNCTIONS
'
'
'
'''
def create_group_membership(ride):
    try:
        group = Group.query.get(ride.id)

        for passenger in ride.passengers:
            group_membership_passenger = GroupMembership(user_id=passenger.id, group_id=group.id)
            db.session.add(group_membership_passenger)

        db.session.add(group)
        db.session.commit()

        return group
    
    except Exception as e:
        return {"error": str(e)}
    

# Add message to group convo (POST)
@app.post('/api/groups/<int:group_id>/add_message_from/<int:user_id>')
def add_message_to_group(group_id, user_id):
    try:
        data = request.json
        
        # Check if the user belongs to the group
        group = Group.query.get(group_id)
        if not group:
            return {"error": "Group not found."}, 404
        
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found."}, 404
        
        if user not in group.members:
            return {"error": "User is not a member of the group."}, 403
        
        timestamp_now = datetime.utcnow()
        
        message = Message(
            content=data.get("content"),
            timestamp=timestamp_now,
            sender_id=user_id,
            group_id=group_id
        )
        
        db.session.add(message)
        db.session.commit()
        
        return message.to_dict(rules=['-group', '-sender']), 200

    except Exception as e:
        return {"error": str(e)}, 500

@app.get('/api/groups/<int:id>')
def get_group_by_id(id):
    try:
        group = Group.query.get(id)
        if not group:
            return {"error": "Group not found."}, 404
        
        return group.to_dict(rules=['-members.groups', 
                                    '-members.password_hash', 
                                    '-members.rides_as_driver',
                                    '-members.rides_as_passenger',
                                    '-members.groups',
                                    '-members.profile_pic',
                                    '-messages.sender',
                                    '-members.sent_messages']), 200
    
    except Exception as e:
        return {"error": str(e)}, 500
    
@app.get('/api/groups/<int:id>/messages')
def get_messages_by_group(id):
    try:
        group = Group.query.get(id)
        if not group:
            return {"error": "Group not found."}, 404
        
        messages = [message.to_dict(rules=['-sender']) for message in group.messages]
        return messages, 200
    
    except Exception as e:
        return {"error": str(e)}, 500

    
@app.get('/api/users/<int:user_id>/groups')
def get_groups_by_user_id(user_id):
    try:
        groups = Group.query.filter(Group.members.any(id=user_id)).all()
        
        return [group.to_dict(rules=['-members.groups', 
                                      '-members.password_hash', 
                                      '-members.rides_as_driver',
                                      '-members.rides_as_passenger',
                                      '-members.groups',
                                      '-messages.sender',
                                      '-members.sent_messages']) for group in groups], 200
    
    except Exception as e:
        return {"error": str(e)}, 500

'''
'
'
MESSAGING FUNCTIONS
'
'
'
'''

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

        create_group_membership(ride)
    
        ride.update_emissions_after_join()

        try:
            driver_user = User.query.get(ride.driver_id)
            driver_user.calculate_total_distance_traveled()
        except Exception as e:
            return {"error": f"Error updating total distance traveled for driver: {e}"}, 500
        
        try:
            driver_user = driver_user = User.query.get(ride.driver_id)
            driver_user.calculate_total_emissions_saved()
        except Exception as e:
            return {"error": f"Error updating total emissions traveled for driver: {e}"}, 500

        # Update total distance traveled for the passenger
        try:
            passenger.calculate_total_distance_traveled()
        except Exception as e:
            return {"error": f"Error updating total distance traveled for passenger: {e}"}, 500
        
        try:
            passenger.calculate_total_emissions_saved()
        except Exception as e:
            return {"error": f"Error updating total emissions traveled for driver: {e}"}, 500

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
            ride.update_emissions_after_join()

            # Remove corresponding group membership
            group_membership = GroupMembership.query.filter_by(user_id=passenger_id, group_id=ride_id).first()
            if group_membership:
                db.session.delete(group_membership)

            # Update total distance traveled for the driver
            try:
                driver_user = User.query.get(ride.driver_id)
                driver_user.calculate_total_distance_traveled()
            except Exception as e:
                return {"error": f"Error updating total distance traveled for driver: {e}"}, 500
            
            try:
                driver_user = driver_user = User.query.get(ride.driver_id)
                driver_user.calculate_total_emissions_saved()
            except Exception as e:
                return {"error": f"Error updating total emissions traveled for driver: {e}"}, 500

            # Update total distance traveled for the removed passenger
            try:
                passenger.calculate_total_distance_traveled()
            except Exception as e:
                return {"error": f"Error updating total distance traveled for passenger: {e}"}, 500
            
            try:
                passenger.calculate_total_emissions_saved()
            except Exception as e:
                return {"error": f"Error updating total emissions traveled for driver: {e}"}, 500

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
        
        if ride.driver_id != driver_id:
            return {"error": "User is not the driver of the ride."}, 403
        
        # Determine the group associated with the ride
        group = Group.query.filter_by(id=ride_id).first()
        if not group:
            return {"error": "Group not found."}, 404 

        db.session.delete(ride)
        db.session.delete(group)  # Delete the associated group
        db.session.commit()

        return {"message": "Ride and associated group deleted successfully."}, 200

    except Exception as e:
        return {"error": str(e)}

    

@app.patch('/api/users/<int:id>')
def patch_user_data(id):
    try:
        data = request.json
        user = db.session.get(User, id)

        for key in data:
            setattr(user, key, data[key])

        db.session.add(user)
        db.session.commit()

        return user.to_dict(rules=['-groups', '-rides_as_passenger', '-rides_as_driver', '-password_hash']), 201 

    except Exception as e:
        return {"error": str(e)}, 500
    
    
if __name__ == "__main__":
    app.run(port=5555, debug=True)