import { useParams } from 'react-router';
import { useState, useEffect } from 'react';

function Profile() {
	const [profile, setProfile] = useState({});

	const { id } = useParams();

	useEffect(() => {
		fetch(`/api/users/${id}`)
			.then((res) => res.json())
			.then((data) => setProfile(data));
	}, []);

	return (
		<div>
			<h1>
				{profile.first_name} {profile.last_name} Profile
			</h1>
		</div>
	);
}

export default Profile;
