export interface ProfileTask {
  name: string;
  duration_ns: number;
  children?: Array<ProfileTask>;
}

type Profile = ProfileTask;

export default Profile;
